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
    console.log(departure_time,arrival_time)
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
    const tripDate = moment(tripDateStr, "YYYY-MM-DD"); // e.g., "2025-05-01"

    const trips = await Trip.find({ from: currentStop });

    for (let trip of trips) {
        const tripDepTime = moment.utc(trip.departure);
        const tripArrTime = moment.utc(trip.arrival);

        const tripDepTimeOnly = moment({ hour: tripDepTime.hour(), minute: tripDepTime.minute() });
        const tripArrTimeOnly = moment({ hour: tripArrTime.hour(), minute: tripArrTime.minute() });

        if (tripDepTimeOnly.isBefore(departureMoment)) continue;

        if (tripArrTimeOnly.isBefore(tripDepTimeOnly)) {
            tripArrTimeOnly.add(1, 'day');
        }

        // 🔹 Build the full departure DateTime by combining tripDate with trip time
        const fullDepartureDateTime = tripDate.clone().hour(tripDepTime.hour()).minute(tripDepTime.minute());

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

        console.log(result)
        
        const bookedSeats = result.length > 0 ? result[0].totalSeats : 0;
        const availableSeats = capacity - bookedSeats;
        

        const newRoute = [...routeSoFar, {
            trip_id: trip._id,
            bus_id: trip.bus_id,
            from: trip.from,
            to: trip.to,
            fare: bus.fare,
            departure: tripDepTimeOnly.format("HH:mm"),
            arrival: tripArrTimeOnly.format("HH:mm"),
            availableSeats
        }];

        if (trip.to === destination) {
            possibleRoutes.push(newRoute);
        } else {
            const nextDepTime = tripArrTimeOnly.format("HH:mm");
            const furtherRoutes = await findRoutes__(trip.to, destination, nextDepTime, newRoute, tripDateStr, maxTransfers);
            possibleRoutes.push(...furtherRoutes);
        }
    }

    possibleRoutes.sort((a, b) => {
        const aTime = moment(a[a.length - 1].arrival, "HH:mm");
        const bTime = moment(b[b.length - 1].arrival, "HH:mm");
        return aTime.diff(bTime);
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


  

