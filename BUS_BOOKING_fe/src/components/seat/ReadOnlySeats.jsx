import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineChair } from "react-icons/md";
import { GiSteeringWheel } from "react-icons/gi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

const seatLayouts = {
  40: [
    [null, null, null, null, 1, 2],
    [3, 4, null, null, 5, 6],
    [7, 8, null, null, 9, 10],
    [11, 12, null, null, 13, 14],
    [15, 16, null, null, 17, 18],
    [19, 20, null, null, 21, 22],
    [23, 24, null, null, 25, 26],
    [27, 28, null, null, 29, 30],
    [31, 32, null, null, 33, 34],
    [35, 36, 37, 38, 39, 40],
  ],
  48: [
    [null, null, null, null, 1, 2],
    [3, 4, null, null, 5, 6],
    [7, 8, null, null, 9, 10],
    [11, 12, null, null, 13, 14],
    [15, 16, null, null, 17, 18],
    [19, 20, null, null, 21, 22],
    [23, 24, null, null, 25, 26],
    [27, 28, null, null, 29, 30],
    [31, 32, null, null, 33, 34],
    [35, 36, null, null, 37, 38],
    [39, 40, null, null, 41, 42],
    [43, 44, 45, 46, 47, 48],
  ],
  56: [
    [null, null, null, null, 1, 2],
    [3, 4, null, null, 5, 6],
    [7, 8, null, null, 9, 10],
    [11, 12, null, null, 13, 14],
    [15, 16, null, null, 17, 18],
    [19, 20, null, null, 21, 22],
    [23, 24, null, null, 25, 26],
    [27, 28, null, null, 29, 30],
    [31, 32, null, null, 33, 34],
    [35, 36, null, null, 37, 38],
    [39, 40, null, null, 41, 42],
    [43, 44, null, null, 45, 46],
    [47, 48, null, null, 49, 50],
    [51, 52, 53, 54, 55, 56],
  ],
};

const Seat = ({ seatNumber, isBooked }) => {
  const colorClass = isBooked ? "text-red-500" : "text-neutral-600";

  return seatNumber ? (
    <MdOutlineChair
      className={`text-2xl sm:text-3xl -rotate-90 cursor-default ${colorClass}`}
      title={
        isBooked
          ? `Seat ${seatNumber} (Booked)`
          : `Seat ${seatNumber} (Available)`
      }
    />
  ) : (
    <div></div> // Placeholder for aisle
  );
};

const ReadOnlyBusSeatLayout = ({ tripId, tripDate, capacity = 56, fare }) => {
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/booking/booked-seats/${tripId}/${tripDate}`
        );
        setBookedSeats(res.data.map(Number));
        setLoading(false);
      } catch (err) {
        console.error("Error loading booked seats:", err);
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [tripId, tripDate]);

  const layout = seatLayouts[capacity] || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        Loading seat data...
      </div>
    );
  }

  return (
    <div className="space-y-5 p-2 sm:p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl text-neutral-800 dark:text-neutral-100 font-medium">
          Seat Layout
        </h2>
        <div className="text-sm">
          <span className="font-bold">{bookedSeats.length}</span> of{" "}
          <span className="font-bold">{capacity}</span> seats booked
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-center gap-8">
        {/* Seat layout section */}
        <div className="w-auto">
          <div className="overflow-x-auto pb-4">
            <div className="mx-auto">
              <div className="w-max">
                <div className="flex w-full items-start justify-between border-b-2 border-dashed border-neutral-300 dark:border-neutral-800">
                  <div></div>
                  <GiSteeringWheel className="text-3xl sm:text-4xl text-violet-600 mr-1" />
                </div>

                {/* Seat layout */}
                <div className="space-y-2 sm:space-y-3 w-full mt-4">
                  {layout.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-6 gap-2 sm:gap-3 justify-center"
                    >
                      {row.map((seatNumber, colIndex) => (
                        <Seat
                          key={`${rowIndex}-${colIndex}`}
                          seatNumber={seatNumber}
                          isBooked={bookedSeats.includes(seatNumber)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-row md:flex-col gap-6 md:gap-4 justify-center md:justify-start">
          <div className="flex items-center gap-x-2">
            <MdOutlineChair className="text-lg text-neutral-600 -rotate-90" />
            <p className="text-xs sm:text-sm">Available</p>
          </div>
          <div className="flex items-center gap-x-2">
            <MdOutlineChair className="text-lg text-red-500 -rotate-90" />
            <p className="text-xs sm:text-sm">Booked</p>
          </div>
          {fare && (
            <div className="flex items-center gap-x-2">
              <RiMoneyRupeeCircleLine className="text-lg text-neutral-500" />
              <p className="text-xs sm:text-sm">Rs. {fare}</p>
            </div>
          )}
        </div>
      </div>

      {/* List of booked seat numbers */}
      {bookedSeats.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="font-medium mb-2">Booked Seats:</p>
          <div className="flex flex-wrap gap-2">
            {bookedSeats.map((seat) => (
              <div
                key={seat}
                className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-sm"
              >
                {seat}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadOnlyBusSeatLayout;
