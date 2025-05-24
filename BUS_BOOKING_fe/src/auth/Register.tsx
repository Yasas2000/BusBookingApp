import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { UserType } from "src/types/userType";
import { useSelector } from "react-redux";
import { useToast } from "src/utils/useToast";
import { getRoleFromToken, isAccessTokenAvailable } from "./AuthUtils";

export default function Register() {
  const navigate = useNavigate();
  const { successToast } = useToast();
  const [userType, setUserType] = useState<UserType>(UserType.CUSTOMER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    busId: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (isAccessTokenAvailable()) {
      setRole(getRoleFromToken());
    }
  }, [])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobile = (mobile: string) => {
    // Sri Lankan mobile number format
    const re = /^(?:\+94|0)[1-9][0-9]{8}$/;
    return re.test(mobile);
  };

  const validateBusId = (busId: string) => {
    // Simple format validation for bus ID
    const re = /^[A-Z]{2,3}[0-9]{3,4}$/;
    return re.test(busId);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = "Please enter a valid Sri Lankan mobile number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (userType === UserType.CONDUCTOR && !formData.busId.trim()) {
      newErrors.busId = "Bus ID is required for conductors";
    } else if (userType === UserType.CONDUCTOR && !validateBusId(formData.busId.toUpperCase())) {
      newErrors.busId = "Please enter a valid bus ID (e.g., NA1234)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear the specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userType,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        ...(userType === UserType.CONDUCTOR && { busId: formData.busId.toLowerCase() })
      };

      await axios.post('/user/register', payload);
      successToast("Successfully registered");
      navigate('/login');
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-neutral-100 dark:bg-neutral-900">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-violet-600 mb-2">Create Account</h1>
          <p className="text-center text-neutral-600 dark:text-neutral-400">Join us for a better journey experience</p>
        </div>

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}

        <form className="mt-8 space-y-6 bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
          {role === 'admin' && (
            <div className="mb-4">
              <label className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">Register as:</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="customer"
                    checked={userType === UserType.CUSTOMER}
                    onChange={() => setUserType(UserType.CUSTOMER)}
                    className="mr-2 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-neutral-800 dark:text-neutral-100">Customer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="conductor"
                    checked={userType === UserType.CONDUCTOR}
                    onChange={() => setUserType(UserType.CONDUCTOR)}
                    className="mr-2 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-neutral-800 dark:text-neutral-100">Conductor</span>
                </label>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${errors.name ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${errors.email ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
                placeholder="example@email.com"
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="mobile" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${errors.mobile ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
                placeholder="+94 77 123 4567"
              />
              {errors.mobile && <p className="mt-1 text-red-500 text-sm">{errors.mobile}</p>}
            </div>

            {userType === UserType.CONDUCTOR && (
              <div>
                <label htmlFor="busId" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
                  Bus ID
                </label>
                <input
                  id="busId"
                  name="busId"
                  type="text"
                  value={formData.busId}
                  onChange={handleInputChange}
                  className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${errors.busId ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
                  placeholder="NA1234"
                />
                {errors.busId && <p className="mt-1 text-red-500 text-sm">{errors.busId}</p>}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${errors.password ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
                placeholder="Enter password"
              />
              {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border ${errors.confirmPassword ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-900'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-neutral-50 font-medium text-base px-6 py-3 rounded-md hover:bg-violet-700 ease-in-out duration-300 flex justify-center"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-violet-600 hover:text-violet-700">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
