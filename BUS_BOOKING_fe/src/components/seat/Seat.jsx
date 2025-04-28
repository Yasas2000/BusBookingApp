import React, { useState } from "react";

import { MdOutlineChair } from "react-icons/md";
import { GiSteeringWheel } from "react-icons/gi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

const Seat = ({ seatNumber, isSelected, onClick }) => {
  return (
    <MdOutlineChair
      className={`text-3xl -rotate-90 cursor-pointer ${
        isSelected ? "text-violet-600" : "text-neutral-600"
      }`}
      onClick={onClick}
    />
  );
};

const BusSeatLayout = () => {
  const totalSeats = 41;
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 10) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        alert("You can only select up to 10 seats.");
      }
    }
  };

  const renderSeats = () => {
    let seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      seats.push(
        <Seat
          key={i}
          seatNumber={i}
          isSelected={selectedSeats.includes(i)}
          onClick={() => handleSeatClick(i)}
        />
      );
    }
    return seats;
  };

  return (
    <div className="space-y-5 p-4">
      <h2 className="text-xl text-neutral-800 dark:text-neutral-100 font-medium">
        Choose a Seat
      </h2>

      {/* Seat layout grid */}
      <div className="w-full flex flex-col lg:flex-row justify-between gap-8">
        {/* Seats and steering wheel */}
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-auto border-r-2 border-dashed border-neutral-300 dark:border-neutral-800 flex justify-center">
            <GiSteeringWheel className="text-4xl mt-6 text-violet-600 -rotate-90" />
          </div>

          {/* Seats */}
          <div className="flex flex-col items-center w-full">
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {renderSeats().slice(0, 10)}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {renderSeats().slice(10, 20)}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {renderSeats().slice(20, 21)}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {renderSeats().slice(21, 31)}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {renderSeats().slice(31, 41)}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions and price */}
        <div className="space-y-3 w-full sm:w-40">
          <div className="flex items-center gap-x-2">
            <MdOutlineChair className="text-lg text-neutral-500 -rotate-90" />
            <p className="text-neutral-900 dark:text-neutral-200 text-sm font-normal">
              Available
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <MdOutlineChair className="text-lg text-red-500 -rotate-90" />
            <p className="text-neutral-900 dark:text-neutral-200 text-sm font-normal">
              Booked
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <MdOutlineChair className="text-lg text-violet-500 -rotate-90" />
            <p className="text-neutral-900 dark:text-neutral-200 text-sm font-normal">
              Selected
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <RiMoneyRupeeCircleLine className="text-lg text-neutral-500" />
            <p className="text-neutral-900 dark:text-neutral-200 text-sm font-normal">
              Rs.750
            </p>
          </div>
        </div>
      </div>

      {/* Selected seats */}
      {selectedSeats.length > 0 && (
        <div className="!mt-10">
          <h3 className="text-lg font-bold">Selected seats</h3>
          <div className="flex flex-wrap">
            {selectedSeats.map((seat) => (
              <div
                key={seat}
                className="w-10 h-10 rounded-md m-1.5 text-lg font-medium bg-violet-600/30 flex items-center justify-center"
              >
                {seat}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total price */}
      {selectedSeats.length > 0 && (
        <div className="!mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <h3 className="text-lg font-bold">Total Fair Price</h3>
          <p className="text-lg font-medium">
            Rs. {selectedSeats.length * 750}
          </p>
          <span className="text-sm text-neutral-400 dark:text-neutral-600 font-normal">
            (Including all taxes)
          </span>
        </div>
      )}
    </div>
  );
};

export default BusSeatLayout;
