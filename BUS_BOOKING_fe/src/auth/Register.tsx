import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { UserType } from "src/types/userType";

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>(UserType.CUSTOMER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    busId: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const payload = {
        userType,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        ...(userType === 'CONDUCTOR' && { busId: formData.busId.toUpperCase() })
      };

      await axios.post('/user/register', payload);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Register as:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="customer"
                checked={userType === UserType.CUSTOMER}
                onChange={() => setUserType(UserType.CUSTOMER)}
                className="mr-2"
              />
              Customer
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="conductor"
                checked={userType === UserType.CONDUCTOR}
                onChange={() => setUserType(UserType.CONDUCTOR)}
                className="mr-2"
              />
              Conductor
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="name">Full Name</label>
          <input
            className="w-full px-3 py-2 border rounded"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="address">Email</label>
          <input
            className="w-full px-3 py-2 border rounded"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="yyyy@gmail.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="password">Password</label>
            <input
              className="w-full px-3 py-2 border rounded"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              minLength={6}
            />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="mobile">Mobile Number</label>
          <input
            className="w-full px-3 py-2 border rounded"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="071-234-5678"
            required
          />
        </div>

        {userType === UserType.CONDUCTOR && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold" htmlFor="busNumber">Bus Number</label>
            <input
              className="w-full px-3 py-2 border rounded"
              name="busId"
              type="text"
              value={formData.busId}
              onChange={handleInputChange}
              placeholder="NA1234"
              required={userType === UserType.CONDUCTOR}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>

        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
