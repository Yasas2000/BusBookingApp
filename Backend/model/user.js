const mongoose = require("mongoose");
const bus = require("./bus");

const UserSchema = new mongoose.Schema({
  name: {
    require: true,
    type: String
  },
  email: { type: String, unique: true },
  phone: {
    require: true,
    type: String
  },
  password: {
    require: true,
    type: String
  },
  role: {
    type: String,
    enum: ["user", "admin", "bus"],
    default: "user",
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
  },
});

module.exports = mongoose.model("User", UserSchema);