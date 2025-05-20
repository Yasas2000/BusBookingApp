const mongoose = require("mongoose");
const Payment = require("../model/payment");
const Booking = require("../model/booking");
const { toCamelCase, capitalize } = require("../util/textUtil");

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

    // Create the payment
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

    res.json({
      message: "Payment processed and bookings confirmed.",
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
