const mongoose = require("mongoose")
const Payment = require("../model/payment");
const Booking = require("../model/booking")

exports.processPayment = async(req,res)=>{
    const session = await mongoose.startSession(); // Start transaction session
    session.startTransaction();
    try{
        const userId = req.user.userId
        const{seatNumber,amount,payment_method, bus_id} = req.body

        const booking = new Booking({user_id:userId , seatNumber , bus_id})
        await booking.save({session});

        const payment = new Payment({
            booking_id:booking._id,
            user_id:userId,
            amount,
            payment_method,
            payment_status:"Completed"
        });

        await payment.save();

        booking.payment_id = payment._id;
        await booking.save({session});

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Booking and Payment successful", booking, payment });
    }catch (error) {
        await session.abortTransaction(); // Rollback if error occurs
        session.endSession();
        res.status(500).json({ message: "Transaction failed", error: error.message });
    }
}
