import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Bus from "src/assets/bus9.png";
import { FaStar } from "react-icons/fa6";
import BusSeatLayout from "src/components/seat/Seat";
import axios from "axios";
import { useToast } from "src/utils/useToast";
import { useDispatch } from "react-redux";
import { fetchCartData } from 'src/redux/cartSlice';
import { capitalize, toUpperCaseLettersOnly} from "src/utils/formattingUtils";


const Details = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [messageText, setMessageText] = useState('');
  const { errorToast, successToast } = useToast();
  const dispatch = useDispatch();
  
  // Store trip data in sessionStorage to persist through login redirects
  useEffect(() => {
    // If trip data is in location state, save it to sessionStorage
    if (location.state?.trip_id) {
      sessionStorage.setItem('selectedTrip', JSON.stringify(location.state));
      setTrip(location.state);
    } 
    // If no trip in state but we have it in sessionStorage, retrieve it
    else {
      const savedTrip = sessionStorage.getItem('selectedTrip');
      if (savedTrip) {
        setTrip(JSON.parse(savedTrip));
      } else {
        navigate('/search');
      }
    }
  }, [location.state, navigate]);

  const showBookingMessage = (type, text) => {
    setMessageType(type);
    setMessageText(text);
    setShowMessage(true);
    
    setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  };

  const handleBooking = async () => {
    if (!trip) {
      showBookingMessage('error', 'Trip details not available. Please try again.');
      navigate('/search');
      return;
    }
    
    if (selectedSeats.length === 0) {
      errorToast("Please select at least one seat");
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
      
      const response = await axios.post('/booking/book-seat', bookingData);
      dispatch(fetchCartData());
      
      if (response.data) {
        successToast('Booking successful!');
        
        sessionStorage.removeItem('selectedTrip');
        
        setTimeout(() => {
          const searchForm = sessionStorage.getItem('searchForm');
          const searchParams = searchForm ? JSON.parse(searchForm) : null;
          
          navigate('/search', { 
            state: { 
              success: true,
              message: 'Your booking was successful!',
              searchParams: searchParams
            } 
          });
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: location.pathname } });
      } else {
        console.error('Booking failed:', error);
      errorToast('Booking failed. Please try again.');
      }
    } finally {
      setIsBooking(false);
    }
  };
  
  if (!trip) {
    return <div className="flex justify-center items-center h-screen">Loading trip details...</div>;
  }
  
  return (
    <div className="w-full px-4 sm:px-7 md:px-16 lg:px-28 pt-[8ch] my-8 md:my-[2ch]">
      {showMessage && (
        <div className="fixed top-[10ch] left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-auto">
          <div className={`${messageType === 'success' ? 'bg-violet-600' : 'bg-red-500'} text-white rounded-lg shadow-lg p-4 flex items-center justify-center`}>
            {messageType === 'success' && (
              <div className="bg-white rounded-full p-1 mr-3">
                <svg className="w-5 h-5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <p className="font-medium">{messageText}</p>
          </div>
        </div>
      )}
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
        <div className="space-y-6 md:space-y-8">
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
              {trip.busType || "Luxury"} Bus
              <span className="block md:inline text-sm md:text-base font-normal text-neutral-400 dark:text-neutral-500 md:ml-3">
                ({toUpperCaseLettersOnly(trip.bus_id) || "Bus Number Plate Number"})
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
              Superb Bus with comfortable seating and excellent service.
            </p>
          </div>
        </div>

        {/* Trip details and booking section */}
        <div className="space-y-6 md:space-y-10">
          <div className="space-y-6">
            <div className="space-y-3 md:space-y-5">
              <h1 className="text-xl text-neutral-800 dark:text-neutral-100 font-medium">
                Your Destination
              </h1>
              <div className="w-full flex sm:flex-row items-center gap-y-2 sm:gap-x-3">
                <div className="w-full sm:w-fit text-base font-semibold">
                  From:- <span className="ml-1 font-medium">{capitalize(trip.from)}</span>
                </div>
                <div className="flex-1">
                  <div className="w-full h-[1px] border border-dashed-neutral-200 dark:border-neutral-800/80"></div>
                </div>
                <div className="w-full sm:w-fit text-base font-semibold">
                  To:- <span className="ml-1 font-medium">{capitalize(trip.to)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-5">
              <div className="w-full flex items-center gap-x-3">
                <div className="w-fit text-base font-semibold">
                  Bus Depart at:{" "}
                  <span className="ml-1 font-medium">{trip.departureDate} {trip.departure}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <BusSeatLayout
              tripId={trip.trip_id}
              tripDate={trip.departureDate}
              capacity={trip.capacity || 56}
              fare={trip.fare}
              onSeatSelect={setSelectedSeats}
            />
          </div>

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
