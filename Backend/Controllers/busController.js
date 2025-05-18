// controllers/busController.js
const Bus = require('../model/bus');
const Trip = require('../model/trip');
const User = require('../model/user');
const moment = require("moment-timezone");
const mongoose = require('mongoose');

// Register a new bus operator with bus and trips
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

    // Check if bus_id already exists
    const existingBus = await Bus.findOne({ bus_id });
    if (existingBus) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Bus with this plate number already exists' });
    }

    // Check if operator email already exists
    const existingUser = await User.findOne({ email: operatorEmail });
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new bus
    const bus = new Bus({
      bus_id,
      bus_name:name,
      bus_type:busType,
      permit_number:permitNumber,
      operator_id: operatorEmail,
      phone: operatorMobile,
      capacity,
      fare
    });
    await bus.save({ session });

    const hashedPassword = await bycrypt.hash(operatorPassword,10);

    // Create new bus operator user
    const user = new User({
      name: operatorName,
      email: operatorEmail,
      password: hashedPassword,
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

// Get all buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    console.error('Error fetching bus:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get trips by bus ID
exports.getTripsByBusId = async (req, res) => {
  try {
    const trips = await Trip.find({ bus_id: req.params.busId }).sort({ departure: 1 });
    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
