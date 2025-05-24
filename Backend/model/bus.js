const mongoose = require("mongoose")

const BusSchema = new mongoose.Schema({
  bus_id: {
    require: true,
    type: String
  },
  bus_name: {
    require: true,
    type: String
  },
  bus_type: {
    require: true,
    type: String
  },
  capacity: {
    require: true,
    type: Number
  },
  fare: {
    require: true,
    type: Number
  },
  permit_number: {
    require: true,
    type: String
  },
  operator_id: String
});

module.exports = mongoose.model("Bus", BusSchema);