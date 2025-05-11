import React, { useState } from "react";
import axios from "axios";
import { getUserEmailFromToken, setAuthDetails } from "src/auth/AuthUtils";
import { useNavigate} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setUser } from "src/redux/userSlice";

export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const dispatch = useDispatch();

	const login = async (event: React.FormEvent) => {
    	event.preventDefault();

		try {
			const { data } = await axios.post("/user/login", {email,password});
			await setAuthDetails(data);

			const userEmail = await getUserEmailFromToken();
			const response = await axios.get(`user/whoami?email=${userEmail}`);
			dispatch(setUser(response.data));

			navigate('/dashboard');
		} catch (error) {
			console.log("error in login");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<form
				className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
				onSubmit={login}
			>
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
				<div className="mb-4">
					<label className="block mb-1 font-semibold" htmlFor="email">
						Email
					</label>
					<input
						className="w-full px-3 py-2 border rounded"
						name="email"
						type="email"
						onChange={(event) => {setEmail(event.target.value)}}
						placeholder="Enter email"
						autoComplete="username"
						required
					/>
				</div>
				<div className="mb-6">
					<label className="block mb-1 font-semibold" htmlFor="password">
						Password
					</label>
					<input
						className="w-full px-3 py-2 border rounded"
						name="password"
						type="password"
						onChange={(event) => {setPassword(event.target.value)}}
						placeholder="Enter password"
						autoComplete="current-password"
						required
					/>
				</div>
				<div className="flex justify-end mb-4">
  					<span 
    					className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm"
   						 onClick={() => navigate('/register')}
  					>
   						 Create an account
 					 </span>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
				>
					Login
				</button>
			</form>
		</div>
	);
}
