const Trip = require("../model/trip")
const Bus = require("../model/bus");
const Booking = require("../model/booking");
const moment = require("moment-timezone");


const parseTimeToLocalDate = (timeStr) => {
    return moment.tz(timeStr, "HH:mm", "+5.30").toDate();
};

exports.insertTrip = async(req, res)=>{
    try{const {bus_id, from, to , departure, arrival}= req.body;
    let departure_time = moment.utc(departure, "HH:mm");
    let arrival_time = moment.utc(arrival, "HH:mm");
    const trip = new Trip({bus_id, from, to , departure:departure_time, arrival:arrival_time});
    await trip.save();
    res.json({message:"Trip is enterd",trip,departure_time})}catch(error){
        console.log(error)
        res.status(500).json({ message:"Internal Server Error",error: error.message });
    }
}


const findRoutes__ = async (currentStop, destination, departureTimeStr, routeSoFar, tripDateStr, maxTransfers = 3) => {
    if (routeSoFar.length > maxTransfers) return [];

    const possibleRoutes = [];
    const departureMoment = moment(departureTimeStr, "HH:mm");
    const tripDate = moment.utc(tripDateStr, "YYYY-MM-DD"); // e.g., "2025-05-01"

    const trips = await Trip.find({ from: currentStop });

    for (let trip of trips) {
        const tripDepTime = moment.utc(trip.departure);
        const tripArrTime = moment.utc(trip.arrival);

        const tripDepTimeOnly = moment({ hour: tripDepTime.hour(), minute: tripDepTime.minute() });
        const tripArrTimeOnly = moment({ hour: tripArrTime.hour(), minute: tripArrTime.minute() });

        if (tripDepTimeOnly.isBefore(departureMoment)) continue;

        // Check if this is an overnight trip
        const isOvernightTrip = tripArrTimeOnly.isBefore(tripDepTimeOnly);
        
        // If it's an overnight trip, add 1 day to arrival time
        if (isOvernightTrip) {
            tripArrTimeOnly.add(1, 'day');
        }

        // 🔹 Build the full departure DateTime by combining tripDate with trip time
        const fullDepartureDateTime = tripDate.clone().hour(tripDepTime.hour()).minute(tripDepTime.minute());
        
        // 🔹 Build the full arrival DateTime
        const fullArrivalDateTime = tripDate.clone().hour(tripArrTime.hour()).minute(tripArrTime.minute());
        
        // If it's an overnight trip, add 1 day to the arrival date
        if (isOvernightTrip) {
            fullArrivalDateTime.add(1, 'day');
        }

        // 🔹 Get bus capacity
        const bus = await Bus.findOne({ bus_id: trip.bus_id });
        const capacity = bus?.capacity || 0;

        // 🔹 Count existing bookings for this trip on this date
        const result = await Booking.aggregate([
            {
                $match: {
                    trip_id: trip._id,
                    booking_status: { $in: ["pending", "confirmed"] },
                    departure_date: tripDate.toDate()
                }
            },
            {
                $project: {
                    seatCount: { $size: "$seatNumbers" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSeats: { $sum: "$seatCount" }
                }
            }
        ]);

        console.log(tripDate.toDate());
        
        const bookedSeats = result.length > 0 ? result[0].totalSeats : 0;
        const availableSeats = capacity - bookedSeats;
        
        // Calculate next trip date - if this is an overnight trip and we're connecting to another trip
        const nextTripDate = isOvernightTrip ? 
            tripDate.clone().add(1, 'day').format("YYYY-MM-DD") : 
            tripDate.format("YYYY-MM-DD");

        const newRoute = [...routeSoFar, {
            trip_id: trip._id,
            bus_id: trip.bus_id,
            from: trip.from,
            to: trip.to,
            fare: bus.fare,
            departure: tripDepTimeOnly.format("HH:mm"),
            arrival: tripArrTimeOnly.format("HH:mm"),
            departureDate: tripDate.format("YYYY-MM-DD"),
            // arrivalDate: isOvernightTrip ? 
            //     tripDate.clone().add(1, 'day').format("YYYY-MM-DD") : 
            //     tripDate.format("YYYY-MM-DD"),
            availableSeats
        }];
        console.log(newRoute);

        if (trip.to === destination) {
            possibleRoutes.push(newRoute);
        } else {
            const nextDepTime = tripArrTimeOnly.format("HH:mm");
            // Use the arrival date as the next trip date for connecting trips
            const furtherRoutes = await findRoutes__(
                trip.to, 
                destination, 
                nextDepTime, 
                newRoute, 
                nextTripDate, // Use the potentially incremented date
                maxTransfers
            );
            possibleRoutes.push(...furtherRoutes);
        }
    }

    possibleRoutes.sort((a, b) => {
        // Sort by total travel time
        const aFirstDep = moment(`${a[0].departureDate} ${a[0].departure}`, "YYYY-MM-DD HH:mm");
        const aLastArr = moment(`${a[a.length-1].arrivalDate} ${a[a.length-1].arrival}`, "YYYY-MM-DD HH:mm");
        
        const bFirstDep = moment(`${b[0].departureDate} ${b[0].departure}`, "YYYY-MM-DD HH:mm");
        const bLastArr = moment(`${b[b.length-1].arrivalDate} ${b[b.length-1].arrival}`, "YYYY-MM-DD HH:mm");
        
        const aDuration = aLastArr.diff(aFirstDep);
        const bDuration = bLastArr.diff(bFirstDep);
        
        return aDuration - bDuration;
    });

    return possibleRoutes.length ? [possibleRoutes] : [];
};



exports.findMultiLegRoutes = async (req, res) => {
    try {
        const { start, destination, departureTime, tripDateStr, maxTransfers = 3 } = req.body;

        if (!start || !destination || !departureTime) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let routes = await findRoutes__(start, destination, departureTime, [], tripDateStr, maxTransfers);
        res.json({ routes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const findRoutesForBus = async (bus_id, tripDateStr) => {
    const tripDate = moment.utc(tripDateStr, "YYYY-MM-DD");

    // First check if bus exists
    const bus = await Bus.findById(bus_id);
    if (!bus) {
        throw new Error("Bus not found");
    }

    const capacity = bus.capacity || 0;
    const busPlateNumber = bus.bus_id; // This is the plate number

    // Find trips using the plate number
    const trips = await Trip.find({ bus_id: busPlateNumber });
    
    // Common bus details that don't need to be repeated for each route
    const busDetails = {
        bus_id: busPlateNumber,
        capacity,
        fare: bus.fare
    };
    
    const routes = [];

    for (let trip of trips) {
        const tripDepTime = moment.utc(trip.departure);
        const tripArrTime = moment.utc(trip.arrival);

        const tripDepTimeOnly = moment({ hour: tripDepTime.hour(), minute: tripDepTime.minute() });
        const tripArrTimeOnly = moment({ hour: tripArrTime.hour(), minute: tripArrTime.minute() });

        // Simple check for display purposes
        if (tripArrTimeOnly.isBefore(tripDepTimeOnly)) {
            tripArrTimeOnly.add(1, 'day');
        }

        const result = await Booking.aggregate([
            {
                $match: {
                    trip_id: trip._id,
                    booking_status: { $in: ["pending", "confirmed"] },
                    departure_date: tripDate.toDate()
                }
            },
            {
                $project: {
                    seatCount: { $size: "$seatNumbers" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSeats: { $sum: "$seatCount" }
                }
            }
        ]);

        const bookedSeats = result.length > 0 ? result[0].totalSeats : 0;

        routes.push({
            trip_id: trip._id,
            from: trip.from,
            to: trip.to,
            departure: tripDepTimeOnly.format("HH:mm"),
            arrival: tripArrTimeOnly.format("HH:mm"),
            bookedSeats
        });
    }

    // Return both the bus details and the routes
    return { busDetails, routes };
};

exports.getRoutesForBus = async (req, res) => {
    try {
        if (req.user.role !== "bus") {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const bus_id = req.user.busId;
        const { tripDateStr } = req.params;

        if (!bus_id || !tripDateStr) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { busDetails, routes } = await findRoutesForBus(bus_id, tripDateStr);
        res.json({ busDetails, routes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

  

