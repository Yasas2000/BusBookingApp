const mongoose = require("mongoose");
const Payment = require("../model/payment");
const Booking = require("../model/booking");
const { toCamelCase, capitalize } = require("../util/textUtil");
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');

const getEmailTemplate = async () => {
  const templatePath = path.join(__dirname, '../templates/ticket-template.html');
  const source = await fs.readFile(templatePath, 'utf-8');
  return handlebars.compile(source);
};

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const sendTicketEmail = async (booking, userEmail) => {
  try {
    const transporter = createTransporter();
    const template = await getEmailTemplate();

    // Format date and time
    const departureDate = new Date(booking.departure_date);
    const formattedDate = departureDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const departureTime = booking.trip_id.departure;
    const arrivalTime = booking.trip_id.arrival;

    // Prepare data for the email template
    const emailData = {
      ticketId: booking._id,
      busId: booking.bus_id,
      from: capitalize(booking.trip_id.from),
      to: capitalize(booking.trip_id.to),
      departureDate: formattedDate,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      seatNumbers: booking.seatNumbers.join(', '),
      totalPrice: booking.price,
      logoUrl: 'https://drive.google.com/file/d/1yN_vF69oREZfzNZLTOucbgQ86cxleWb_/view?usp=sharing'
    };

    const htmlToSend = template(emailData);

    const mailOptions = {
      from: '"Bus Ease" <bus.ease.lk.official@gmail.com>',
      to: userEmail,
      subject: 'Your Bus Ticket Confirmation',
      html: htmlToSend,
      attachments: [
        {
          filename: 'bus-ease-logo.png',
          path: path.join(__dirname, '../assets/logo.png'),
          cid: 'logo' // This ID will be used in the template to reference the image
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const processPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let userId = req.user.userId;
    let { bookingIds } = req.body;

    const debugBookings = await Booking.find({ _id: { $in: bookingIds } });

    console.log(debugBookings);

    const bookings = await Booking.find({
      _id: { $in: bookingIds },
      user_id: userId,
      booking_status: "pending",
    }).session(session);

    if (bookings.length === 0) {
      throw new Error("No pending bookings found for payment.");
    }

    const payment = new Payment({
      user_id: userId,
      payment_status: "Completed",
    });
    await payment.save({ session });

    // Update all bookings with payment_id and mark as confirmed
    await Booking.updateMany(
      { _id: { $in: bookingIds } },
      {
        $set: {
          payment_id: payment._id,
          booking_status: "confirmed",
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const email = req.user.email;
    const userEmail = email

    // Send ticket email for each booking
    for (const booking of bookings) {
      await sendTicketEmail(booking, userEmail);
    }

    res.json({
      message: "Payment processed and bookings confirmed. Tickets send by email",
      payment,
    });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ message: "Transaction failed", error: error.message });
  }
};

const createCheckoutSession = async (req, res) => {
  const bookings = req.body.bookings;
  const idParams = new URLSearchParams();

  const line_items = bookings.map((booking) => {
    idParams.append("id", booking._id);
    const date = new Date(booking.trip_id.departure);
    const from = capitalize(booking.trip_id.from);
    const to = capitalize(booking.trip_id.to);

    return {
      price_data: {
        currency: "lkr",
        product_data: {
          name: `From ${from} To ${to} at ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
          images: [
            "https://www.shutterstock.com/image-vector/bus-ticketpublic-transport-side-view-600nw-2418862123.jpg",
          ],
        },
        unit_amount: (booking.price * 100) / booking.seatNumbers.length,
      },
      quantity: booking.seatNumbers.length,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: line_items,
    mode: "payment",
    success_url: process.env.SUCCESS_URL + `&${idParams.toString()}`,
    cancel_url: process.env.CANCEL_URL,
  });

  res.json({ id: session.id });
};
module.exports = {
  processPayment,
  createCheckoutSession,
};
