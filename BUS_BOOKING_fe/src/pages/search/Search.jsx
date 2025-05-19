import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
const toUpperCaseLettersOnly = (str) => str?.replace(/[a-z]/g, c => c.toUpperCase());


const Search = () => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
  });

  const [routes, setRoutes] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { from, to, date, time } = form;
    if (!from || !to || !date || !time) return alert("Please fill all fields");

    try {
      const response = await axios.post("/trip/find-trip", {
        start: from,
        destination: to,
        departureTime: time,
        tripDateStr: date,
        maxTransfers: 3,
      });

      setRoutes(response.data.routes || []);
    } catch (error) {
      console.error(error);
      alert("Error fetching routes");
    }
  };


  const navigate = useNavigate();
  // Function to handle booking
  const handleBooking = (trip) => {
    navigate('/detail', { state: trip });
  };

  return (
    <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 my-[8ch]">
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
              <option value="">Select Location</option>
              <option value="matara">Matara</option>
              <option value="galle">Galle</option>
              <option value="kandy">Kandy</option>
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
              <option value="">Select Location</option>
              <option value="colombo">Colombo</option>
              <option value="galle">Galle</option>
              <option value="jaffna">Jaffna</option>
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
              onChange={handleChange}
              value={form.time}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <button
              onClick={handleSubmit}
              className="w-full h-12 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>

      {routes.length > 0 && (
        <div className="mt-12 space-y-6">
          {routes.map((outerGroup, i) =>
            outerGroup.map((group, j) =>
              group.map((route, k) => (
                <div
                  key={`${i}-${j}-${k}`}
                  className="bg-neutral-100 dark:bg-neutral-900/40 rounded-md p-6 shadow-md space-y-4"
                >
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                    Route {k + 1}
                  </h3>

                  {route.map((bus, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center md:justify-between border border-neutral-300 dark:border-neutral-800 p-4 rounded-md bg-neutral-50 dark:bg-neutral-800/50 space-y-3 md:space-y-0"
                    >
                      <div className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                        <p>
                          🚌 <strong>{toUpperCaseLettersOnly(bus.bus_id)}</strong> —{" "}
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
              ))
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
