const mongoose = require("mongoose");
const Payment = require("../model/payment");
const Booking = require("../model/booking");

exports.processPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.userId;
    const { bookingIds, amount, payment_method } = req.body;

    // Fetch all pending bookings for the user from provided IDs
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
      amount,
      payment_method,
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
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Transaction failed", error: error.message });
  }
};
