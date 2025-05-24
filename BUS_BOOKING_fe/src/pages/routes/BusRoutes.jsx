// src/pages/routes/BusRoutes.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import { FaSort, FaSortUp, FaSortDown, FaChair } from 'react-icons/fa';
import { capitalize, toUpperCaseLettersOnly } from "src/utils/formattingUtils";

const BusOperatorRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [busDetails, setBusDetails] = useState(null);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'departure', direction: 'asc' });
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, [selectedDate]);

  useEffect(() => {
    // Apply sorting
    let result = [...routes];

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'departure') {
          return sortConfig.direction === 'asc'
            ? a.departure.localeCompare(b.departure)
            : b.departure.localeCompare(a.departure);
        } else if (sortConfig.key === 'from') {
          return sortConfig.direction === 'asc'
            ? a.from.localeCompare(b.from)
            : b.from.localeCompare(a.from);
        } else if (sortConfig.key === 'to') {
          return sortConfig.direction === 'asc'
            ? a.to.localeCompare(b.to)
            : b.to.localeCompare(a.to);
        } else if (sortConfig.key === 'bookedSeats') {
          return sortConfig.direction === 'asc'
            ? a.bookedSeats - b.bookedSeats
            : b.bookedSeats - a.bookedSeats;
        }
        return 0;
      });
    }

    setFilteredRoutes(result);
  }, [routes, sortConfig]);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/trip/find-bus-trip/${selectedDate}`);
      setRoutes(response.data.routes);
      setBusDetails(response.data.busDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setLoading(false);
    }
  };

  function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
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
  const handleViewSeats = (trip) => {
    trip.capacity = busDetails.capacity;
    trip.fare = busDetails.fare;
    trip.date = selectedDate;
    navigate('/operator/seats', { state: trip });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time not available';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));

      return formatInTimeZone(date, 'UTC', 'hh:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-[12ch]">
      <h1 className="text-3xl font-bold text-center text-violet-600 mb-8">Bus Routes</h1>

      {busDetails && (
        <div className="mb-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold">{toUpperCaseLettersOnly(busDetails.bus_id)}</h2>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <p>Capacity: {busDetails.capacity} seats</p>
            <p>Fare: Rs. {busDetails.fare}</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <label htmlFor="date" className="block mb-2 font-medium text-sm">
              Choose Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              onChange={handleDateChange}
              value={selectedDate}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-10 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none"
            />
          </div>

          <div className="flex space-x-4 self-end">
            <button
              onClick={() => handleSort('departure')}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600"
            >
              Sort by Time {getSortIcon('departure')}
            </button>
            <button
              onClick={() => handleSort('bookedSeats')}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600"
            >
              Sort by Bookings {getSortIcon('bookedSeats')}
            </button>
          </div>
        </div>

        <div className="hidden sm:grid grid-cols-5 p-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          <div>From</div>
          <div>To</div>
          <div>Departure</div>
          <div>Arrival</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Routes List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredRoutes.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No routes found for this bus on the selected date
            </div>
          ) : (
            filteredRoutes.map((route) => (
              <div key={route.trip_id} className="p-4">
                {/* Desktop View */}
                <div className="hidden sm:grid sm:grid-cols-5 items-center">
                  <div className="text-sm">
                    <p className="font-medium">{capitalize(route.from)}</p>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">{capitalize(route.to)}</p>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">{route.departure}</p>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">{route.arrival}</p>
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <div className="text-center">
                      <p className="font-medium">{route.bookedSeats} / {busDetails?.capacity || 0}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-violet-600 h-2.5 rounded-full"
                          style={{ width: `${(route.bookedSeats / (busDetails?.capacity || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewSeats(route)}
                      className="px-4 py-1 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition-colors flex items-center"
                    >
                      <FaChair className="mr-1" /> View Seats
                    </button>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="sm:hidden space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{capitalize(route.from)} - {capitalize(route.to)}</p>
                      <div className="flex space-x-2 text-xs text-gray-500 mt-1">
                        <span>{route.departure}</span>
                        <span>-</span>
                        <span>{route.arrival}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{route.bookedSeats} / {busDetails?.capacity || 0}</p>
                      <p className="text-xs text-gray-500">Seats</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-violet-600 h-2.5 rounded-full"
                      style={{ width: `${(route.bookedSeats / (busDetails?.capacity || 1)) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleViewSeats(route)}
                      className="px-3 py-1 bg-violet-600 text-white text-xs rounded-md hover:bg-violet-700 transition-colors flex items-center"
                    >
                      <FaChair className="mr-1" /> View Seats
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BusOperatorRoutes;
