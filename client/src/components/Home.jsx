import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
	// Check for existing name in local storage
	const [name, setName] = useState(() => localStorage.getItem("userName") || "");
	const [hasStarted, setHasStarted] = useState(() => !!localStorage.getItem("userName"));

	const targetDate = new Date("2024-12-19T00:00:00z");

	// Calculate remaining time for countdown
	const calculateTimeLeft = () => {
		const now = new Date();
		const difference = targetDate - now;

		if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

		return {
			days: Math.floor(difference / (1000 * 60 * 60 * 24)),
			hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			minutes: Math.floor((difference % (1000 * 60)) / (1000 * 60)),
			seconds: Math.floor(difference % 1000)
		};
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

	// Update countdown every second
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(calculateTimeLeft);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Handle start journey button click
	const handleStart = () => {
		if (name.trim()) {
			localStorage.setItem("userName", name.trim());
			setHasStarted(true);
		} else {
			alert("Please enter your name to proceed!");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black flex flex-col items-center justify-center text-center p-6 text-white">
			<h1 className="text-4xl font-bold text-purple-300 mb-6">
				Countdown to Asritha's Birthday 🎉
			</h1>

			<div className="text-3xl font-semibold mb-8">
				<span>{timeLeft.days} Days </span>
				<span>{timeLeft.hours} Hours </span>
				<span>{timeLeft.minutes} Minutes </span>
				<span>{timeLeft.seconds} Seconds</span>
			</div>

			<div className="w-full max-w-md bg-gray-800 rounded-full h-2.5 mb-8">
				<div
					className="h-2.5 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full"
					style={{
						width: `${
							(1 - (targetDate - new Date()) / (targetDate - new Date("2024-12-01T00:00:00Z"))) *
							100
						}%`
					}}
				></div>
			</div>

			{!hasStarted ? (
				<div className="mb-6 w-full max-w-sm">
					{/* Form to take the name */}
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter your nickname"
						className="w-full p-3 text-black rounded-lg mb-4"
					/>
					<button
						onClick={handleStart}
						className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600"
					>
						Start Your Journey 🚀
					</button>
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-md">
					{/* Links to components */}
					<Link to="/write-message">
						<button className="w-full p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center space-x-2">
							<span className="text-xl">✉️</span>
							<span>Write a Message</span>
						</button>
					</Link>

					<Link to="/dedicate-song">
						<button className="w-full p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center space-x-2">
							<span className="text-xl">🎶</span>
							<span>Dedicate a Song</span>
						</button>
					</Link>

					<Link to="/photo-gallery">
						<button className="w-full p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center space-x-2">
							<span className="text-xl">📸</span>
							<span>Photo Gallery</span>
						</button>
					</Link>
				</div>
			)}
		</div>
	);
};

export default Home;
