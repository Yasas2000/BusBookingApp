const mongoose = require("mongoose")

const tripSchema = new mongoose.Schema({
  bus_id: {
    require: true,
    type: String
  },
  from: {
    require: true,
    type: String
  },
  to: {
    require: true,
    type: String
  },
  departure: {
    require: true,
    type: Date
  },
  arrival: {
    require: true,
    type: Date
  }
})

module.exports = mongoose.model("Trip", tripSchema)