import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatInTimeZone } from "date-fns-tz";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { removeFare, fetchCartData } from "src/redux/cartSlice";
import CountdownTimer from "src/components/countDownTimer";
import { capitalize, toUpperCaseLettersOnly } from "src/utils/formattingUtils";

const Cart = () => {
  const [total, setTotal] = useState(0);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const navigate = useNavigate();
  const loading = useSelector((state) => state.cart.loading);
  const bookings = useSelector((state) => state.cart.fares);
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    calculateTotal();
  }, [selectedBookings, bookings]);

  useEffect(() => {
    handleSelectAll();
  }, [bookings]);

  const calculateTotal = () => {
    const totalPrice = bookings
      .filter((booking) => selectedBookings.includes(booking._id))
      .reduce((sum, booking) => sum + parseInt(booking.price || 0), 0);
    setTotal(totalPrice);
  };

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`/booking/cancel/${bookingId}`);
      if (selectedBookings.includes(bookingId)) {
        setSelectedBookings((prev) => prev.filter((id) => id !== bookingId));
      }
      await dispatch(removeFare(bookingId));
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const handleBookingExpired = (bookingId) => {
    // Remove expired booking from selected bookings
    setSelectedBookings((prev) => prev.filter((id) => id !== bookingId));

    // Remove from redux store
    dispatch(removeFare(bookingId));
  };

  const handleSelectBooking = (bookingId) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    setSelectedBookings(
      selectedBookings.length === bookings.length
        ? []
        : bookings.map((b) => b._id)
    );
  };

  const proceedToCheckout = async () => {
    if (selectedBookings.length === 0) {
      alert("Please select at least one booking to checkout");
      return;
    }
    const selectedBookingsData = bookings.filter((b) =>
      selectedBookings.includes(b._id)
    );
    console.log(selectedBookingsData);

    const stripe = await loadStripe(
      "pk_test_51RPerE4EuMQqPc9ZbAPZ2tn9gA4OPQzaY3ikXbosOM9dUKrqwvskTpJ5byVmJdr1hZ1aMIDGB5qOzpe3f40gAxXe00jSl2lSMs"
    );
    const response = await axios.post("/payment/create-checkout-session", {
      bookings: selectedBookingsData,
    });

    stripe.redirectToCheckout({
      sessionId: response.data.id,
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return (
        <>
          {formatInTimeZone(date, "UTC", "EEEE, MMM d, yyyy")}
          <br />
          {timeString
            ? formatInTimeZone(new Date(timeString), "UTC", "hh:mm a")
            : "Time not available"}
        </>
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-[12ch]">
      <h1 className="text-3xl font-bold text-center text-violet-600 mb-8">
        Booking Details
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
              checked={
                selectedBookings.length === bookings.length &&
                bookings.length > 0
              }
              onChange={handleSelectAll}
            />
            <span className="ml-2 text-sm font-medium">Select All</span>
          </div>

          {/* Column headers - Desktop */}
          <div className="hidden sm:grid sm:grid-cols-6 mb-4 text-sm font-semibold text-gray-700">
            <div></div>
            <div>Bus</div>
            <div>Route</div>
            <div className="text-center">Time Left</div>
            <div className="text-right">Price</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Column headers - Mobile */}
          <div className="grid grid-cols-2 sm:hidden mb-2 text-sm font-semibold text-gray-700">
            <div className="pl-12">Bus & Route</div>
            <div className="grid grid-cols-2">
              <div className="text-right">Price</div>
              <div className="text-center">Actions</div>
            </div>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border-b border-gray-200 dark:border-gray-700 py-4"
              >
                {/* Desktop View */}
                <div className="hidden sm:grid sm:grid-cols-6 items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
                      checked={selectedBookings.includes(booking._id)}
                      onChange={() => handleSelectBooking(booking._id)}
                    />
                  </div>

                  <div className="sm:self-start text-sm">
                    <p className="font-medium">
                      {toUpperCaseLettersOnly(booking.bus_id)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(
                        booking.departure_date,
                        booking.trip_id?.departure
                      )}
                    </p>
                  </div>

                  <div className="text-sm text-center sm:self-start">
                    <p className="font-medium">
                      {capitalize(booking.trip_id?.from)} -{" "}
                      {capitalize(booking.trip_id?.to)}
                    </p>
                    <p className="text-gray-600 text-xs">
                      Seats: {booking.seatNumbers.length} (
                      {booking.seatNumbers.join(", ")})
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="text-center">
                    <CountdownTimer
                      expiresAt={booking.expires_at}
                      onExpire={() => handleBookingExpired(booking._id)}
                    />
                  </div>

                  <div className="text-right font-bold text-lg sm:text-xl">
                    <p
                      className={
                        selectedBookings.includes(booking._id)
                          ? "text-violet-600"
                          : "text-gray-400"
                      }
                    >
                      {booking.price ||
                        booking.seatNumbers.length * booking.trip_id?.price ||
                        0}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="px-3 py-1 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="sm:hidden grid grid-cols-2">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-1 text-violet-600 border-gray-300 focus:ring-violet-500"
                      checked={selectedBookings.includes(booking._id)}
                      onChange={() => handleSelectBooking(booking._id)}
                    />
                    <div className="ml-2">
                      <p className="font-medium">
                        {toUpperCaseLettersOnly(booking.bus_id)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(
                          booking.departure_date,
                          booking.trip_id?.departure
                        )}
                      </p>
                      <p className="font-medium mt-1">
                        {capitalize(booking.trip_id?.from)} -{" "}
                        {capitalize(booking.trip_id?.to)}
                      </p>
                      <p className="text-gray-600 text-xs">
                        Seats: {booking.seatNumbers.length} (
                        {booking.seatNumbers.join(", ")})
                      </p>
                      <div className="mt-1">
                        <span className="text-xs text-gray-500 mr-2">
                          Expires in:
                        </span>
                        <CountdownTimer
                          expiresAt={booking.expires_at}
                          onExpire={() => handleBookingExpired(booking._id)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 items-center">
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${selectedBookings.includes(booking._id)
                            ? "text-violet-600"
                            : "text-gray-400"
                          }`}
                      >
                        {booking.price ||
                          booking.seatNumbers.length * booking.trip_id?.price ||
                          0}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="px-3 py-1 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm mb-4 sm:mb-0">
              <p className="text-gray-600">
                Selected Items: {selectedBookings.length}
              </p>
              <p className="font-bold text-lg">Total</p>
            </div>
            <p className="font-bold text-xl text-violet-600">Rs. {total}</p>
          </div>

          <button
            onClick={proceedToCheckout}
            disabled={selectedBookings.length === 0}
            className={`w-full mt-6 py-3 text-white font-medium rounded-md transition-colors ${selectedBookings.length > 0
                ? "bg-violet-600 hover:bg-violet-700"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
