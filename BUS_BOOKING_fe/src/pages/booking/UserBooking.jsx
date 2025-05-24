import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import { FaSort, FaSortUp, FaSortDown, FaStar } from 'react-icons/fa';
import RatingPopup from 'src/components/rating/Rating';
import { capitalize, toUpperCaseLettersOnly } from "src/utils/formattingUtils";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'departure_date', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchBookings();
      hasFetched.current = true;
    }
  }, []);


  useEffect(() => {
    // Apply filters and sorting
    let result = [...bookings];

    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.booking_status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'departure_date') {
          const dateA = new Date(a.departure_date);
          const dateB = new Date(b.departure_date);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortConfig.key === 'booking_status') {
          if (a.booking_status < b.booking_status) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a.booking_status > b.booking_status) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
        return 0;
      });
    }

    setFilteredBookings(result);
  }, [bookings, sortConfig, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/booking/user-bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
    return sortConfig.direction === 'asc' ?
      <FaSortUp className="ml-1 text-violet-600" /> :
      <FaSortDown className="ml-1 text-violet-600" />;
  };

  const handlePayment = (bookingId) => {
    navigate('/cart');
  };

  const handleReview = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowRatingPopup(true);
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Date not available';

    try {
      const date = new Date(dateString);
      return (
        <>
          {formatInTimeZone(date, 'UTC', 'EEEE, MMMM d, yyyy')}
          <br />
          {timeString ? formatInTimeZone(new Date(timeString), 'UTC', 'hh:mm a') : 'Time not available'}
        </>
      );
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      canceled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {capitalize(status)}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-[12ch]">
      <h1 className="text-3xl font-bold text-center text-violet-600 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">You don't have any bookings yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
          {/* Filter and Sort Controls */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status:
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleSort('departure_date')}
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600"
              >
                Sort by Date {getSortIcon('departure_date')}
              </button>
              <button
                onClick={() => handleSort('booking_status')}
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600"
              >
                Sort by Status {getSortIcon('booking_status')}
              </button>
            </div>
          </div>

          {/* Column headers - Desktop */}
          <div className="hidden sm:grid grid-cols-5 p-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            <div>Bus</div>
            <div>Route & Date</div>
            <div>Seats</div>
            <div className="text-center">Status</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Bookings List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No bookings match your filter criteria
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking._id} className="p-4">
                  {/* Desktop View */}
                  <div className="hidden sm:grid sm:grid-cols-5 items-center">
                    <div className="text-sm">
                      <p className="font-medium">{toUpperCaseLettersOnly(booking.bus_id)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.price ? `Rs. ${booking.price}` : ''}
                      </p>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium">{capitalize(booking.trip_id?.from)} - {capitalize(booking.trip_id?.to)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(booking.departure_date, booking.trip_id?.departure)}
                      </p>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium">{booking.seatNumbers.length} Seats</p>
                      <p className="text-xs text-gray-500">{booking.seatNumbers.join(', ')}</p>
                    </div>

                    <div className="flex justify-center">
                      {getStatusBadge(booking.booking_status)}
                    </div>

                    <div className="flex justify-center">
                      {booking.booking_status === 'pending' && (
                        <button
                          onClick={() => handlePayment(booking._id)}
                          className="px-4 py-1 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                      {booking.booking_status === 'completed' && (
                        <button
                          onClick={() => handleReview(booking._id)}
                          className="px-4 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition-colors flex items-center"
                        >
                          <FaStar className="mr-1" /> Review
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="sm:hidden space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{toUpperCaseLettersOnly(booking.bus_id)}</p>
                        <p className="text-sm font-medium mt-1">{capitalize(booking.trip_id?.from)} - {capitalize(booking.trip_id?.to)}</p>
                      </div>
                      <div>
                        {getStatusBadge(booking.booking_status)}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      {formatDateTime(booking.departure_date, booking.trip_id?.departure)}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">Seats: {booking.seatNumbers.length} ({booking.seatNumbers.join(', ')})</p>
                        <p className="text-sm font-medium mt-1">{booking.price ? `Rs. ${booking.price}` : ''}</p>
                      </div>

                      <div>
                        {booking.booking_status === 'pending' && (
                          <button
                            onClick={() => handlePayment(booking._id)}
                            className="px-3 py-1 bg-violet-600 text-white text-xs rounded-md hover:bg-violet-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                        {booking.booking_status === 'completed' && (
                          <button
                            onClick={() => handleReview(booking._id)}
                            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition-colors flex items-center"
                          >
                            <FaStar className="mr-1" /> Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {showRatingPopup && (
              <RatingPopup
                bookingId={selectedBookingId}
                onClose={() => {
                  setShowRatingPopup(false);
                  setSelectedBookingId(null);
                  fetchBookings();
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>

  );
};

export default UserBookings;
