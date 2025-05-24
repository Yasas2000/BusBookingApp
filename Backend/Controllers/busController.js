const Bus = require('../model/bus');
const Trip = require('../model/trip');
const User = require('../model/user');
const moment = require("moment-timezone");
const mongoose = require('mongoose');
const bycrypt = require("bcryptjs")

exports.registerBusOperator = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      bus_id,
      name,
      capacity,
      fare,
      operatorName,
      operatorEmail,
      operatorPassword,
      operatorMobile,
      routes,
      busType,
      permitNumber
    } = req.body;

    const existingBus = await Bus.findOne({ bus_id });
    if (existingBus) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Bus with this plate number already exists' });
    }

    const existingUser = await User.findOne({ email: operatorEmail });
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const bus = new Bus({
      bus_id,
      bus_name: name,
      bus_type: busType,
      permit_number: permitNumber,
      operator_id: operatorEmail,
      capacity,
      fare
    });
    await bus.save({ session });

    const hashedPassword = await bycrypt.hash(operatorPassword, 10);

    const user = new User({
      name: operatorName,
      email: operatorEmail,
      password: hashedPassword,
      phone: operatorMobile,
      role: 'bus',
      bus_id: bus._id
    });
    await user.save({ session });

    // Create trips for each route and time slot
    const trips = [];
    for (const route of routes) {
      for (const timeSlot of route.timeSlots) {
        // Create departure and arrival dates
        let departure_time = moment.utc(timeSlot.departure, "HH:mm");
        let arrival_time = moment.utc(timeSlot.arrival, "HH:mm");

        // If arrival time is earlier than departure time, it's likely the next day
        if (arrival_time < departure_time) {
          arrival_time.setDate(arrival_time.getDate() + 1);
        }

        const trip = new Trip({
          bus_id,
          from: route.from,
          to: route.to,
          departure: departure_time,
          arrival: arrival_time
        });
        await trip.save({ session });
        trips.push(trip);
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Bus operator registered successfully',
      bus,
      trips,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error registering bus operator:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};