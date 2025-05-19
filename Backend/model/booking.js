const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bus_id: { type: String , require:true },
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    departure_date: { type: Date, required: true },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    seatNumbers: [{ type: String, required: true }], // Array of seat numbers
    price: { type: Number, required: true },
    booking_status: { 
        type: String, 
        enum: ["pending", "confirmed", "canceled", "completed"], 
        default: "pending" 
    }
    },{timestamps:true});

module.exports = mongoose.model("Booking", BookingSchema);
