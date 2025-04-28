const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  booking_id:{ type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  payment_status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  payment_method: { type: String, required: true }
},{timestamps:true});

module.exports = mongoose.model("Payment", PaymentSchema);
