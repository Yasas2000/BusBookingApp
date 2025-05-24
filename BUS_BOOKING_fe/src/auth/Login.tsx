import React, { useState } from "react";
import axios from "axios";
import { getUserEmailFromToken, setAuthDetails } from "src/auth/AuthUtils";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

export default function Login() {

	const navigate = useNavigate();
	const location = useLocation();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const login = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setError("");

		try {
			const { data } = await axios.post("/user/login", { email, password });
			await setAuthDetails(data);
			const originalPath = location.state?.from?.pathname || '/dashboard';
			navigate(originalPath);
		} catch (error: any) {
			console.error("Error in login:", error);
			setError(error.response?.data?.message || "Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-neutral-100 dark:bg-neutral-900">
			<div className="w-full max-w-md space-y-8">
				<div>
					<h1 className="text-3xl font-bold text-center text-violet-600 mb-2">Welcome Back</h1>
					<p className="text-center text-neutral-600 dark:text-neutral-400">Sign in to continue your journey</p>
				</div>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
						<span className="block sm:inline">{error}</span>
					</div>
				)}

				<form className="mt-8 space-y-6 bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md" onSubmit={login}>
					<div className="space-y-4">
						<div>
							<label htmlFor="email" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
								placeholder="Enter your email"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
								placeholder="Enter your password"
							/>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
							/>
							<label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600 dark:text-neutral-400">
								Remember me
							</label>
						</div>

						<div className="text-sm">
							<Link to="/forgot-password" className="font-medium text-violet-600 hover:text-violet-700">
								Forgot password?
							</Link>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-violet-600 text-neutral-50 font-medium text-base px-6 py-3 rounded-md hover:bg-violet-700 ease-in-out duration-300 flex justify-center"
						>
							{loading ? "Signing in..." : "Sign in"}
						</button>
					</div>

					<div className="text-center mt-4">
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Don't have an account?{" "}
							<Link to="/register" className="font-medium text-violet-600 hover:text-violet-700">
								Sign up
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
