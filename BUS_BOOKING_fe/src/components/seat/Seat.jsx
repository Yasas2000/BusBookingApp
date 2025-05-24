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

const Seat = ({ seatNumber, isSelected, isBooked, onClick }) => {
  let colorClass = "text-neutral-600";
  if (isBooked) colorClass = "text-red-500";
  else if (isSelected) colorClass = "text-violet-600";

  return seatNumber ? (
    <MdOutlineChair
      className={`text-2xl sm:text-3xl -rotate-90 ${isBooked ? "cursor-not-allowed" : "cursor-pointer"
        } ${colorClass}`}
      onClick={onClick}
    />
  ) : (
    <div></div> // Placeholder for aisle
  );
};

const BusSeatLayout = ({
  tripId,
  tripDate,
  capacity = 56,
  fare,
  onSeatSelect,
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await axios.get(
          `/booking/booked-seats/${tripId}/${tripDate}`
        );
        setBookedSeats(res.data.map(Number));
      } catch (err) {
        console.error("Error loading booked seats:", err);
      }
    };

    fetchBookedSeats();
  }, [tripId, tripDate]);

  const handleSeatClick = (seatNumber) => {
    let newSelectedSeats;
    if (selectedSeats.includes(seatNumber)) {
      newSelectedSeats = selectedSeats.filter((seat) => seat !== seatNumber);
    } else {
      if (selectedSeats.length < 10) {
        newSelectedSeats = [...selectedSeats, seatNumber];
      } else {
        alert("You can only select up to 10 seats.");
        return;
      }
    }

    setSelectedSeats(newSelectedSeats);
    if (onSeatSelect) {
      onSeatSelect(newSelectedSeats);
    }
  };

  const layout = seatLayouts[capacity] || [];

  return (
    <div className="space-y-5 p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl text-neutral-800 dark:text-neutral-100 font-medium">
        Choose a Seat
      </h2>

      <div className="w-full flex flex-row lg:flex-row justify-center gap-8 sm:gap-8">
        {/* Seat layout section*/}
        <div className="w-auto">
          {/* Scrollable container for small screens */}
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
                      className="grid grid-cols-6 gap-2 sm:gap-3 justify-center" // Reduced gap on small screens
                    >
                      {row.map((seatNumber, colIndex) => (
                        <Seat
                          key={`${rowIndex}-${colIndex}`}
                          seatNumber={seatNumber}
                          isSelected={selectedSeats.includes(seatNumber)}
                          isBooked={bookedSeats.includes(seatNumber)}
                          onClick={() =>
                            seatNumber && !bookedSeats.includes(seatNumber)
                              ? handleSeatClick(seatNumber)
                              : null
                          }
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
        <div className="flex flex-col lg:flex-col flex-wrap gap-4 sm:gap-3 justify-start lg:justify-start lg:w-40">
          <div className="flex items-center gap-x-2">
            <MdOutlineChair className="text-lg text-neutral-500 -rotate-90" />
            <p className="text-xs sm:text-sm">Available</p>
          </div>
          <div className="flex items-center gap-x-2">
            <MdOutlineChair className="text-lg text-red-500 -rotate-90" />
            <p className="text-xs sm:text-sm">Booked</p>
          </div>
          <div className="flex items-center gap-x-2">
            <MdOutlineChair className="text-lg text-violet-500 -rotate-90" />
            <p className="text-xs sm:text-sm">Selected</p>
          </div>
          <div className="flex items-center gap-x-2">
            <RiMoneyRupeeCircleLine className="text-lg text-neutral-500" />
            <p className="text-xs sm:text-sm">Rs. {fare}</p>
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <>
          <div className="!mt-6 sm:!mt-10">
            <h3 className="text-base sm:text-lg font-bold">Selected seats</h3>
            <div className="flex flex-wrap">
              {selectedSeats.map((seat) => (
                <div
                  key={seat}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-md m-1 sm:m-1.5 text-sm sm:text-lg font-medium bg-violet-600/30 flex items-center justify-center"
                >
                  {seat}
                </div>
              ))}
            </div>
          </div>

          <div className="!mt-4 sm:!mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4">
            <h3 className="text-base sm:text-lg font-bold">Total Fare Price</h3>
            <p className="text-base sm:text-lg font-medium">
              Rs. {selectedSeats.length * fare}
            </p>
            <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-600 font-normal">
              (Including all taxes)
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default BusSeatLayout;
