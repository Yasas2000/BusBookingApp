const Trip = require("../model/trip")
const Bus = require("../model/bus");
const Booking = require("../model/booking");
const moment = require("moment-timezone");

exports.insertTrip = async (req, res) => {
    try {
        const { bus_id, from, to, departure, arrival } = req.body;
        let departure_time = moment.utc(departure, "HH:mm");
        let arrival_time = moment.utc(arrival, "HH:mm");
        const trip = new Trip({ bus_id, from, to, departure: departure_time, arrival: arrival_time });
        await trip.save();
        res.json({ message: "Trip is enterd", trip, departure_time })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


const findRoutes__ = async (currentStop, destination, departureTimeStr, routeSoFar, tripDateStr, maxTransfers = 3, visitedStops = new Set()) => {
    if (routeSoFar.length > maxTransfers) return [];

    const newVisitedStops = new Set(visitedStops);
    newVisitedStops.add(currentStop);

    const possibleRoutes = [];
    const departureMoment = moment(departureTimeStr, "HH:mm");
    const tripDate = moment.utc(tripDateStr, "YYYY-MM-DD");

    const trips = await Trip.find({ from: currentStop });

    for (let trip of trips) {
        if (newVisitedStops.has(trip.to)) continue;

        const tripDepTime = moment.utc(trip.departure);
        const tripArrTime = moment.utc(trip.arrival);
        const tripDepTimeOnly = moment({ hour: tripDepTime.hour(), minute: tripDepTime.minute() });
        const tripArrTimeOnly = moment({ hour: tripArrTime.hour(), minute: tripArrTime.minute() });

        if (tripDepTimeOnly.isBefore(departureMoment)) continue;

        const isOvernightTrip = tripArrTimeOnly.isBefore(tripDepTimeOnly);
        if (isOvernightTrip) tripArrTimeOnly.add(1, 'day');

        const fullDepartureDateTime = tripDate.clone().hour(tripDepTime.hour()).minute(tripDepTime.minute());
        const fullArrivalDateTime = tripDate.clone().hour(tripArrTime.hour()).minute(tripArrTime.minute());
        if (isOvernightTrip) fullArrivalDateTime.add(1, 'day');

        const bus = await Bus.findOne({ bus_id: trip.bus_id });
        const capacity = bus?.capacity || 0;

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
        const availableSeats = capacity - bookedSeats;

        const newRoute = [...routeSoFar, {
            trip_id: trip._id,
            bus_id: trip.bus_id,
            from: trip.from,
            to: trip.to,
            fare: bus.fare,
            departure: tripDepTimeOnly.format("HH:mm"),
            arrival: tripArrTimeOnly.format("HH:mm"),
            departureDate: tripDate.format("YYYY-MM-DD"),
            arrivalDate: isOvernightTrip ? tripDate.clone().add(1, 'day').format("YYYY-MM-DD") : tripDate.format("YYYY-MM-DD"),
            availableSeats
        }];

        if (trip.to === destination) {
            possibleRoutes.push(newRoute);
        } else {
            const nextDepTime = tripArrTimeOnly.format("HH:mm");
            const nextTripDate = isOvernightTrip
                ? tripDate.clone().add(1, 'day').format("YYYY-MM-DD")
                : tripDate.format("YYYY-MM-DD");

            const furtherRoutes = await findRoutes__(
                trip.to,
                destination,
                nextDepTime,
                newRoute,
                nextTripDate,
                maxTransfers,
                newVisitedStops
            );

            possibleRoutes.push(...furtherRoutes);
        }
    }

    return possibleRoutes;
};




exports.findMultiLegRoutes = async (req, res) => {
    try {
        const { start, destination, departureTime, tripDateStr, maxTransfers = 3 } = req.body;

        if (!start || !destination || !departureTime || !tripDateStr) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const routes = await findRoutes__(start, destination, departureTime, [], tripDateStr, maxTransfers, new Set());

        routes.sort((a, b) => {
            const aStart = moment(`${a[0].departureDate} ${a[0].departure}`, "YYYY-MM-DD HH:mm");
            const aEnd = moment(`${a[a.length - 1].arrivalDate} ${a[a.length - 1].arrival}`, "YYYY-MM-DD HH:mm");

            const bStart = moment(`${b[0].departureDate} ${b[0].departure}`, "YYYY-MM-DD HH:mm");
            const bEnd = moment(`${b[b.length - 1].arrivalDate} ${b[b.length - 1].arrival}`, "YYYY-MM-DD HH:mm");

            return (aEnd.diff(aStart)) - (bEnd.diff(bStart));
        });

        res.json({ routes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const findRoutesForBus = async (bus_id, tripDateStr) => {
    const tripDate = moment.utc(tripDateStr, "YYYY-MM-DD");

    const bus = await Bus.findById(bus_id);
    if (!bus) {
        throw new Error("Bus not found");
    }

    const capacity = bus.capacity || 0;
    const busPlateNumber = bus.bus_id; // This is the plate number

    const trips = await Trip.find({ bus_id: busPlateNumber });

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



