import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { useToast } from "src/utils/useToast";
import { locations } from "src/data/location";
import { capitalize, toUpperCaseLettersOnly } from "src/utils/formattingUtils";
import { min } from "date-fns";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { errorToast, successToast } = useToast();

  // State for min date and time
  const [minDate, setMinDate] = useState('');
  const [minTime, setMinTime] = useState('');

  // Initialize form with values from location state or sessionStorage
  const [form, setForm] = useState(() => {
    if (location.state?.searchParams) {
      return location.state.searchParams;
    }

    const savedForm = sessionStorage.getItem('searchForm');
    const minDate = new Intl.DateTimeFormat('en-CA').format(new Date());

    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      if (parsedForm.date < minDate) {
        parsedForm.date = minDate;
      }
      return parsedForm;
    }

    return {
      from: "",
      to: "",
      date: "",
      time: "",
    };
  });


  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Set minimum date and time on component mount
  useEffect(() => {
    updateMinDateTime();
  }, []);

  // Update min date and time when form.date changes
  useEffect(() => {
    if (form.date === minDate) {
      updateMinTime();
    } else if (form.date && form.date > minDate) {
      setMinTime('');
    }
  }, [form.date, minDate, form.time]);

  // Function to update minimum date and time
  const updateMinDateTime = () => {
    const now = new Date();
    const today = new Intl.DateTimeFormat('en-CA').format(now);
    setMinDate(today);
    if (!form.date || form.date === today) {
      updateMinTime();
    }
  };

  // Function to update minimum time (3 hours from now)
  const updateMinTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 3);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const threeHoursLater = `${hours}:${minutes}`;
    const currentHour = new Date().getHours();
    const calculatedHour = now.getHours();
    const crossedMidnight = currentHour > calculatedHour;
    setMinTime(threeHoursLater);

    if (crossedMidnight) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = new Intl.DateTimeFormat('en-CA').format(tomorrow);
      setForm(prev => ({
        ...prev,
        date: tomorrowStr,
        time: "00:00"
      }));
    } else {
      if (form.time && form.time < threeHoursLater) {
        setForm(prev => ({
          ...prev,
          time: threeHoursLater
        }));
      }
    }
  };

  useEffect(() => {
    if (location.state?.success) {
      setMessage({
        type: 'success',
        text: location.state.message
      });
      const timer = setTimeout(() => {
        setMessage(null);
        window.history.replaceState({}, document.title);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Auto-search if we have form data from redirect, but only once
  useEffect(() => {
    const shouldSearch = form.from && form.to && form.date && form.time && initialLoad;
    if (shouldSearch) {
      const fetchRoutes = async () => {
        setLoading(true);
        try {
          const response = await axios.post("/trip/find-trip", {
            start: form.from,
            destination: form.to,
            departureTime: form.time,
            tripDateStr: form.date,
            maxTransfers: 3,
          });
          const routesData = response.data.routes || [];
          setRoutes(routesData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      };
      fetchRoutes();
    } else if (initialLoad) {
      setInitialLoad(false);
    }
  }, [form.from, form.to, form.date, form.time, initialLoad]);

  // Save form to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('searchForm', JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { from, to, date, time } = form;
    if (!from || !to || !date || !time) {
      errorToast("Please fill all fields");
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (date === today && time < minTime) {
      errorToast("Please select a time at least 3 hours from today date");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/trip/find-trip", {
        start: from,
        destination: to,
        departureTime: time,
        tripDateStr: date,
        maxTransfers: 3,
      });
      const routesData = response.data.routes || [];
      setRoutes(routesData);
      if (Array.isArray(routesData) && routesData.length === 0) {
        errorToast("No routes available");
      } else if (Array.isArray(routesData) && routesData.length > 0) {
        successToast("Successfully fetched routes");
      }
    } catch (error) {
      console.error(error);
      errorToast("Error fetching routes");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (trip) => {
    const tripWithDate = { ...trip };
    sessionStorage.setItem('searchForm', JSON.stringify(form));
    navigate('/detail', { state: tripWithDate });
  };

  const renderRoutes = () => {
    if (!routes || routes.length === 0) {
      return null;
    }

    try {
      return (
        <div className="mt-12 space-y-6">
          {routes.map((routeSet, routeIndex) => {
            const busObjects = Array.isArray(routeSet)
              ? routeSet.filter(obj => obj && typeof obj === 'object' && obj.bus_id)
              : [];

            if (busObjects.length === 0) return null;

            return (
              <div
                key={routeIndex}
                className="bg-neutral-100 dark:bg-neutral-900/40 rounded-md p-6 shadow-md space-y-4"
              >
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                  Route {routeIndex + 1}
                </h3>
                {busObjects.map((bus, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center md:justify-between border border-neutral-300 dark:border-neutral-800 p-4 rounded-md bg-neutral-50 dark:bg-neutral-800/50 space-y-3 md:space-y-0"
                  >
                    <div className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                      <p>
                        🚌 <strong>{toUpperCaseLettersOnly(bus.bus_id)}</strong> -{" "}
                        <span className="capitalize">{capitalize(bus.from)}</span> →{" "}
                        <span className="capitalize">{capitalize(bus.to)}</span>
                      </p>
                      <p>
                        Departure: <span className="font-medium">{bus.departure}</span> | Arrival:{" "}
                        <span className="font-medium">{bus.arrival}</span>
                      </p>
                      <p>Available Seats: {bus.availableSeats} | Bus Fare: Rs. {bus.fare}</p>
                    </div>
                    <div>
                      <button
                        className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors text-sm"
                        onClick={() => handleBooking(bus)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      );
    } catch (error) {
      console.error("Error rendering routes:", error);
      return (
        <div className="mt-12 p-6 bg-red-100 text-red-700 rounded-md">
          <p>There was an error displaying the routes. Please try searching again.</p>
        </div>
      );
    }
  };

  return (
    <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 my-[8ch]">
      {message && (
        <div className="mb-6 rounded-lg shadow-md overflow-hidden">
          <div className={`p-4 flex items-center ${message.type === 'success' ? 'bg-violet-600' : 'bg-red-500'} text-white`}>
            <div className="flex-shrink-0 mr-3">
              {message.type === 'success' ? (
                <div className="bg-white rounded-full p-1">
                  <svg className="w-5 h-5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-neutral-100 rounded-md dark:bg-neutral-900/40 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 items-end">
          <div>
            <label htmlFor="from" className="block mb-2 font-medium">
              From
            </label>
            <select
              name="from"
              id="from"
              onChange={handleChange}
              value={form.from}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none"
            >
              <option value="">Select location</option>
              {locations.map(location => (
                <option
                  key={location.value}
                  value={location.value}
                  disabled={location.value === form.to}
                >
                  {location.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="to" className="block mb-2 font-medium">
              To
            </label>
            <select
              name="to"
              id="to"
              onChange={handleChange}
              value={form.to}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none"
            >
              <option value="">Select location</option>
              {locations.map(location => (
                <option
                  key={location.value}
                  value={location.value}
                  disabled={location.value === form.from}
                >
                  {location.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block mb-2 font-medium">
              Choose Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              min={minDate}
              onChange={handleChange}
              value={form.date}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="time" className="block mb-2 font-medium">
              Choose Time
            </label>
            <input
              type="time"
              name="time"
              id="time"
              min={form.date === minDate ? minTime : undefined}
              onChange={handleChange}
              value={form.time}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none"
            />
            {form.date === minDate && (
              <p className="text-xs text-gray-500 mt-1">
                Minimum time: {minTime} (3 hours from now)
              </p>
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              {loading ? "Searching..." : "Check Availability"}
            </button>
          </div>
        </div>
      </div>

      {/* Render routes */}
      {renderRoutes()}
    </div>
  );
};

export default Search;
