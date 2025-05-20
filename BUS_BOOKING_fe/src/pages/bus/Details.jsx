import React, {useState} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Bus from "src/assets/bus9.png";
import { FaStar } from "react-icons/fa6";
import BusSeatLayout from "src/components/seat/Seat";
import axios from "axios";
import { useToast } from "src/utils/useToast";

const capitalize = (word) => word?.charAt(0).toUpperCase() + word?.slice(1).toLowerCase();

const Details = () => {
  const { state: trip } = useLocation();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const { errorToast, successToast } = useToast();

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    
    setIsBooking(true);
    
    try {
      const bookingData = {
        bus_id: trip.bus_id,
        trip_id: trip.trip_id,
        departure_date: trip.departureDate,
        seatNumbers: selectedSeats,
        price: selectedSeats.length * trip.fare,
      };

      const response = await axios.post('/booking/book-seat', bookingData
      );
      
      if (response.data) {
        successToast('Booking successful!');
        navigate('/bookings', { state: { bookingDetails: response.data } });
      }
    } catch (error) {
      console.error('Booking failed:', error);
      errorToast('Booking failed. Please try again.');
      console.log(error);
    } finally {
      setIsBooking(false);
    }
  };
  
  return (
    <div className="w-full px-4 sm:px-7 md:px-16 lg:px-28 my-8 md:my-[10ch]">
      {/* Main content grid - changes to single column on mobile */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
        {/* Bus image and details section */}
        <div className="space-y-6 md:space-y-8">
          {/* Image container with proper aspect ratio and centering */}
          <div className="flex justify-center">
            <div className="w-full max-w-md lg:max-w-none">
              <img
                src={Bus}
                alt="Bus Image"
                className="w-full rounded-md object-contain h-auto"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50">
              Luxury Bus
              <span className="block md:inline text-sm md:text-base font-normal text-neutral-400 dark:text-neutral-500 md:ml-3">
                (Bus Number Plate Number)
              </span>
            </h1>
            <div className="flex items-center gap-x-2">
              <div className="flex items-center gap-x-1 text-sm text-yellow-500 dark:text-yellow-600">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-neutral-900 dark:text-neutral-200 text-sm font-normal">
                (4.5)
              </p>
            </div>

            <p className="text-neutral-900 dark:text-neutral-200 text-sm font-normal">
              Superb Bus jbbcjhbdefhdbcjbdjfbjv sdbvjhdfjhbdjvhbejfbjdbc
            </p>
          </div>
        </div>

        {/* Trip details and booking section */}
        <div className="space-y-6 md:space-y-10">
          <div className="space-y-6">
            {/* Destination card */}
            <div className="space-y-3 md:space-y-5">
              <h1 className="text-xl text-neutral-800 dark:text-neutral-100 font-medium">
                Your Destination
              </h1>
              <div className="w-full flex sm:flex-row items-center gap-y-2 sm:gap-x-3">
                <div className="w-full sm:w-fit text-base font-semibold">
                  From:- <span className="ml-1 font-medium">{capitalize(trip?.from)}</span>
                </div>
                <div className="flex-1">
                  <div className="w-full h-[1px] border border-dashed-neutral-200 dark:border-neutral-800/80"></div>
                </div>
                <div className="w-full sm:w-fit text-base font-semibold">
                  To:- <span className="ml-1 font-medium">{capitalize(trip?.to)}</span>
                </div>
              </div>
            </div>

            {/* Departure Card */}
            <div className="space-y-3 md:space-y-5">
              <div className="w-full flex items-center gap-x-3">
                <div className="w-fit text-base font-semibold">
                  Bus Depart at:{" "}
                  <span className="ml-1 font-medium">{trip?.departureDate} {trip?.departure}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Seat Selection */}
          <div className="overflow-x-auto">
            <BusSeatLayout
              tripId={trip?.trip_id}
              tripDate={trip?.departureDate}
              capacity={trip?.capacity || 56}
              fare={trip?.fare}
              onSeatSelect={setSelectedSeats}
            />
          </div>

          {/* Checkout Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="w-full sm:w-fit bg-violet-600 text-neutral-50 font-medium text-base px-6 py-2 rounded-md hover:bg-violet-700 ease-in-out duration-300 text-center"
              onClick={handleBooking}
              disabled={isBooking || selectedSeats.length === 0}
            >
              {isBooking ? "Processing..." : "Book Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
