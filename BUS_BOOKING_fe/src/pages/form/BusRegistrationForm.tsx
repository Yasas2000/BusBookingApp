import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaArrowRight } from "react-icons/fa";
import { locations } from "src/data/location";

interface TimeSlot {
  id: string;
  departure: string;
  arrival: string;
}

interface Route {
  id: string;
  from: string;
  to: string;
  timeSlots: TimeSlot[];
}

interface BusFormData {
  bus_id: string; // plate number
  name: string;
  capacity: number;
  fare: number | string;
  permitNumber: string;
  busType: string;
  operatorName: string;
  operatorEmail: string;
  operatorMobile: string;
  operatorPassword: string;
  routes: Route[];
}

interface ValidationErrors {
  bus_id?: string;
  name?: string;
  fare?: string;
  permitNumber?: string;
  operatorName?: string;
  operatorEmail?: string;
  operatorMobile?: string;
  operatorPassword?: string;
  routes?: string;
}

export default function RegisterBusOperator() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<BusFormData>({
    bus_id: "",
    name: "",
    capacity: 56,
    fare: "",
    permitNumber: "",
    busType: "standard",
    operatorName: "",
    operatorEmail: "",
    operatorMobile: "",
    operatorPassword: "",
    routes: []
  });

  // Generate unique IDs for routes and time slots
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addRoute = () => {
    setFormData({
      ...formData,
      routes: [
        ...formData.routes,
        {
          id: generateId(),
          from: "",
          to: "",
          timeSlots: []
        }
      ]
    });
  };

  const removeRoute = (routeId: string) => {
    setFormData({
      ...formData,
      routes: formData.routes.filter(route => route.id !== routeId)
    });
  };

  const addTimeSlot = (routeId: string) => {
    setFormData({
      ...formData,
      routes: formData.routes.map(route => {
        if (route.id === routeId) {
          return {
            ...route,
            timeSlots: [
              ...route.timeSlots,
              {
                id: generateId(),
                departure: "",
                arrival: ""
              }
            ]
          };
        }
        return route;
      })
    });
  };

  const removeTimeSlot = (routeId: string, timeSlotId: string) => {
    setFormData({
      ...formData,
      routes: formData.routes.map(route => {
        if (route.id === routeId) {
          return {
            ...route,
            timeSlots: route.timeSlots.filter(slot => slot.id !== timeSlotId)
          };
        }
        return route;
      })
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined
      });
    }

    if (name === "fare") {
      const numValue = value === "" ? "" : Number(value);
      setFormData({
        ...formData,
        [name]: numValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "capacity" ? Number(value) : value
      });
    }
  };

  const handleRouteChange = (routeId: string, field: string, value: string) => {
    setFormData({
      ...formData,
      routes: formData.routes.map(route => {
        if (route.id === routeId) {
          return {
            ...route,
            [field]: value
          };
        }
        return route;
      })
    });
  };

  const handleTimeSlotChange = (routeId: string, timeSlotId: string, field: string, value: string) => {
    setFormData({
      ...formData,
      routes: formData.routes.map(route => {
        if (route.id === routeId) {
          return {
            ...route,
            timeSlots: route.timeSlots.map(slot => {
              if (slot.id === timeSlotId) {
                return {
                  ...slot,
                  [field]: value
                };
              }
              return slot;
            })
          };
        }
        return route;
      })
    });
  };

  // Add reverse route (B to A) based on existing route (A to B)
  const addReverseRoute = (routeId: string) => {
    const originalRoute = formData.routes.find(route => route.id === routeId);

    if (originalRoute && originalRoute.from && originalRoute.to) {
      setFormData({
        ...formData,
        routes: [
          ...formData.routes,
          {
            id: generateId(),
            from: originalRoute.to,
            to: originalRoute.from,
            timeSlots: []
          }
        ]
      });
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.bus_id.trim()) {
      errors.bus_id = "Bus plate number is required";
    } else if (!/^[a-zA-Z0-9-]+$/.test(formData.bus_id)) {
      errors.bus_id = "Bus plate number can only contain letters, numbers and hyphens";
    }

    if (!formData.permitNumber.trim()) {
      errors.permitNumber = "Permit number is required";
    }

    if (formData.fare === "" || Number(formData.fare) <= 0) {
      errors.fare = "Fare must be greater than 0";
    }

    if (!formData.operatorEmail.trim()) {
      errors.operatorEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.operatorEmail)) {
      errors.operatorEmail = "Please enter a valid email address";
    }

    if (!formData.operatorMobile.trim()) {
      errors.operatorMobile = "Mobile number is required";
    } else if (!/^(?:\+94|0)[1-9][0-9]{8}$/.test(formData.operatorMobile)) {
      errors.operatorMobile = "Please enter a valid Sri Lankan mobile number";
    }

    if (!formData.operatorPassword) {
      errors.operatorPassword = "Password is required";
    } else if (formData.operatorPassword.length < 6) {
      errors.operatorPassword = "Password must be at least 6 characters";
    }

    if (formData.routes.length === 0) {
      errors.routes = "Please add at least one route";
    } else {
      for (const route of formData.routes) {
        if (!route.from || !route.to) {
          errors.routes = "Please fill in all route details";
          break;
        }
        if (route.from === route.to) {
          errors.routes = "From and To locations cannot be the same";
          break;
        }
        if (route.timeSlots.length === 0) {
          errors.routes = `Please add at least one time slot for route ${route.from} to ${route.to}`;
          break;
        }
        for (const slot of route.timeSlots) {
          if (!slot.departure || !slot.arrival) {
            errors.routes = `Please fill in all time slot details for route ${route.from} to ${route.to}`;
            break;
          }
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formattedData = {
        ...formData,
        bus_id: formData.bus_id.replace(/-/g, '').toLowerCase(),
        fare: Number(formData.fare) // Ensure fare is a number
      };

      console.log("Form data:", formattedData);
      const response = await axios.post("/bus/register", formattedData);

      alert("Bus operator registered successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error registering bus operator:", error);
      setError(error.response?.data?.message || error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-[12ch]">
      <h1 className="text-3xl font-bold text-center text-violet-600 mb-8">Register Bus Operator</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <h2 className="text-xl font-semibold text-violet-600 col-span-full">Bus Details</h2>

          <div>
            <label htmlFor="bus_id" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Bus Plate Number <span className="text-red-500">*</span>
            </label>
            <input
              id="bus_id"
              name="bus_id"
              type="text"
              required
              value={formData.bus_id}
              onChange={handleChange}
              className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${validationErrors.bus_id ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
              placeholder="e.g., NB-1234"
            />
            {validationErrors.bus_id && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.bus_id}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Note: Hyphens will be removed and letters will be converted to lowercase when submitted</p>
          </div>

          <div>
            <label htmlFor="permitNumber" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Permit Number <span className="text-red-500">*</span>
            </label>
            <input
              id="permitNumber"
              name="permitNumber"
              type="text"
              required
              value={formData.permitNumber}
              onChange={handleChange}
              className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${validationErrors.permitNumber ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
              placeholder="e.g., PER-12345"
            />
            {validationErrors.permitNumber && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.permitNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Bus Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="e.g., Luxury Express"
            />
          </div>

          <div>
            <label htmlFor="busType" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Bus Type
            </label>
            <select
              id="busType"
              name="busType"
              value={formData.busType}
              onChange={handleChange}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option value="standard">Standard</option>
              <option value="luxury">Luxury</option>
              <option value="semi-luxury">Semi-Luxury</option>
              <option value="express">Express</option>
              <option value="ac">AC</option>
            </select>
          </div>

          <div>
            <label htmlFor="capacity" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Capacity
            </label>
            <select
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option value={40}>40 Seats</option>
              <option value={48}>48 Seats</option>
              <option value={56}>56 Seats</option>
            </select>
          </div>

          <div>
            <label htmlFor="fare" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Base Fare (Rs.)
            </label>
            <input
              id="fare"
              name="fare"
              type="Number"
              min="0"
              value={formData.fare}
              onChange={handleChange}
              className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${validationErrors.fare ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
              placeholder="e.g., 500"
            />
            {validationErrors.fare && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.fare}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <h2 className="text-xl font-semibold text-violet-600 col-span-full">Operator Details</h2>

          <div>
            <label htmlFor="operatorName" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Operator Name
            </label>
            <input
              id="operatorName"
              name="operatorName"
              type="text"
              value={formData.operatorName}
              onChange={handleChange}
              className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="e.g., John Doe"
            />
          </div>

          <div>
            <label htmlFor="operatorMobile" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              id="operatorMobile"
              name="operatorMobile"
              type="tel"
              required
              value={formData.operatorMobile}
              onChange={handleChange}
              className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${validationErrors.operatorMobile ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
              placeholder="e.g., +94 77 123 4567"
            />
            {validationErrors.operatorMobile && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.operatorMobile}</p>
            )}
          </div>

          <div>
            <label htmlFor="operatorEmail" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="operatorEmail"
              name="operatorEmail"
              type="email"
              required
              value={formData.operatorEmail}
              onChange={handleChange}
              className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${validationErrors.operatorEmail ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
              placeholder="e.g., operator@example.com"
            />
            {validationErrors.operatorEmail && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.operatorEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor="operatorPassword" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="operatorPassword"
              name="operatorPassword"
              type="password"
              required
              value={formData.operatorPassword}
              onChange={handleChange}
              className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${validationErrors.operatorPassword ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
              placeholder="Enter password"
            />
            {validationErrors.operatorPassword && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.operatorPassword}</p>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-violet-600">Routes & Time Slots</h2>
            <button
              type="button"
              onClick={addRoute}
              className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
            >
              <FaPlus className="mr-2" /> Add Route
            </button>
          </div>

          {validationErrors.routes && (
            <p className="mb-4 text-sm text-red-500">{validationErrors.routes}</p>
          )}

          {formData.routes.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No routes added yet. Click "Add Route" to begin.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {formData.routes.map((route, routeIndex) => (
                <div key={route.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Route {routeIndex + 1}</h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => addReverseRoute(route.id)}
                        className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                      >
                        Add Reverse
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRoute(route.id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        <FaTrash className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
                        From
                      </label>
                      <select
                        value={route.from}
                        onChange={(e) => handleRouteChange(route.id, 'from', e.target.value)}
                        className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
                      >
                        <option value="">Select location</option>
                        {locations.map(location => (
                          <option key={location.value} value={location.value}>
                            {location.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
                        To
                      </label>
                      <select
                        value={route.to}
                        onChange={(e) => handleRouteChange(route.id, 'to', e.target.value)}
                        className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
                      >
                        <option value="">Select location</option>
                        {locations.map(location => (
                          <option
                            key={location.value}
                            value={location.value}
                            disabled={location.value === route.from} // Disable same location as "from"
                          >
                            {location.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Time Slots</h4>
                      <button
                        type="button"
                        onClick={() => addTimeSlot(route.id)}
                        className="flex items-center px-3 py-1 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition-colors"
                      >
                        <FaPlus className="mr-1" /> Add Time Slot
                      </button>
                    </div>

                    {route.timeSlots.length === 0 ? (
                      <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">No time slots added yet. Click "Add Time Slot" to begin.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {route.timeSlots.map((slot, slotIndex) => (
                          <div key={slot.id} className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-900 rounded-md">
                            <div className="flex-1 min-w-[120px]">
                              <label className="block mb-1 text-sm font-medium text-neutral-800 dark:text-neutral-100">
                                Departure Time
                              </label>
                              <input
                                type="time"
                                value={slot.departure}
                                onChange={(e) => handleTimeSlotChange(route.id, slot.id, 'departure', e.target.value)}
                                className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-10 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
                              />
                            </div>

                            <FaArrowRight className="text-gray-400 mt-6" />

                            <div className="flex-1 min-w-[120px]">
                              <label className="block mb-1 text-sm font-medium text-neutral-800 dark:text-neutral-100">
                                Arrival Time
                              </label>
                              <input
                                type="time"
                                value={slot.arrival}
                                onChange={(e) => handleTimeSlotChange(route.id, slot.id, 'arrival', e.target.value)}
                                className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-10 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeTimeSlot(route.id, slot.id)}
                              className="p-2 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-violet-600 text-white font-medium rounded-md hover:bg-violet-700 transition-colors flex items-center"
          >
            {loading ? "Registering..." : "Register Bus Operator"}
          </button>
        </div>
      </form>
    </div>
  );
}
