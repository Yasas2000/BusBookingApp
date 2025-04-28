const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bus_id: { type: String , require:true },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    seatNumber: { type: String, required: true },
    booking_status: { type: String, enum: ["confirmed", "canceled"], default: "confirmed" },
    },{timestamps:true});

module.exports = mongoose.model("Booking", BookingSchema);
