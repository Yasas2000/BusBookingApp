import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'customer' | 'conductor'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    busNumber: ''
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
        address: formData.address,
        mobile: formData.mobile,
        ...(userType === 'conductor' && { busNumber: formData.busNumber })
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
                checked={userType === 'customer'}
                onChange={() => setUserType('customer')}
                className="mr-2"
              />
              Customer
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="conductor"
                checked={userType === 'conductor'}
                onChange={() => setUserType('conductor')}
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
          <label className="block mb-2 font-semibold" htmlFor="address">Address</label>
          <input
            className="w-full px-3 py-2 border rounded"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="123 Main Street"
            required
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

        {userType === 'conductor' && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold" htmlFor="busNumber">Bus Number</label>
            <input
              className="w-full px-3 py-2 border rounded"
              name="busNumber"
              type="text"
              value={formData.busNumber}
              onChange={handleInputChange}
              placeholder="NA-1234"
              required={userType === 'conductor'}
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
