import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReadOnlyBusSeatLayout from 'src/components/seat/ReadOnlySeats';
import { FaArrowLeft } from 'react-icons/fa';

const capitalize = (word) => word?.charAt(0).toUpperCase() + word?.slice(1).toLowerCase();


const SeatLayoutView = () => {
  const { state: trip } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-[12ch]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-violet-600 mb-6 hover:text-violet-800 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to Routes
      </button>

      <h1 className="text-2xl font-bold text-center text-violet-600 mb-6">Seat Booking Status</h1>

      <div className="mb-6">
        <p className="text-lg font-medium">Trip : {capitalize(trip.from)} ------ {capitalize(trip.to)}</p>
        <div className="flex justify-start items-center space-x-4 mt-2">
          <p className="text-gray-600">Date: {trip.date}</p>
          <p className="text-gray-600">Time: {trip.departure}</p>
        </div>

      </div>

      <ReadOnlyBusSeatLayout
        tripId={trip.trip_id}
        tripDate={trip.date}
        capacity={trip.capacity}
        fare={trip.fare}
      />
    </div>
  );
};

export default SeatLayoutView;
