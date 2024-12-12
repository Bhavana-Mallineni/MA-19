import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MusicIntegration = () => {
	const [spotifyLink, setSpotifyLink] = useState("");
	const [songInfo, setSongInfo] = useState(null);
	const [isFetching, setIsFetching] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const userName = localStorage.getItem("userName");

	useEffect(() => {
		if (!userName) {
			alert("Username is missing. Please return to the home page and enter your name.");
			navigate("/");
		}
	}, [userName, navigate]);

	const fetchSongDetails = async () => {
		if (!spotifyLink.trim()) {
			alert("Please enter a valid Spotify link.");
			return;
		}

		setIsFetching(true);

		try {
			const response = await axios.post("http://localhost:3000/api/songs/fetch", {
				spotifyLink
			});
			setSongInfo(response.data);
		} catch (error) {
			console.error("Error fetching song details:", error.response?.data || error.message);
			alert("Failed to fetch song details. Please check the link.");
		} finally {
			setIsFetching(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!songInfo || !spotifyLink || !userName) {
			alert("Please fetch the song details and ensure all fields are filled.");
			return;
		}

		setIsSubmitting(true);

		try {
			await axios.post("http://localhost:3000/api/songs", {
				username: userName,
				spotifyLink,
				songName: songInfo.name,
				thumbnail: songInfo.thumbnail
			});
			alert("Song successfully dedicated!");
			navigate("/");
		} catch (error) {
			console.error("Error submitting song:", error.response?.data || error.message);
			alert("Failed to submit the song. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className={`min-h-screen flex flex-col items-center justify-center relative ${
				isFetching || isSubmitting ? "opacity-50" : ""
			} bg-gradient-to-b from-green-700 via-gray-700 to-black p-6 text-white`}
		>
			{/* Spinner Overlay */}
			{(isFetching || isSubmitting) && (
				<div className="absolute flex items-center justify-center top-0 left-0 w-full h-full bg-black bg-opacity-75 z-10">
					<div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}

			<h1 className="text-3xl font-bold mb-6 text-green-400">Dedicate a Song to Asritha 🎶</h1>

			<form
				onSubmit={handleSubmit}
				className="w-full max-w-lg p-6 bg-gray-900 rounded-lg shadow-lg space-y-6"
			>
				<input
					type="url"
					value={spotifyLink}
					onChange={(e) => setSpotifyLink(e.target.value)}
					placeholder="Paste Spotify song link here (https://open.spotify.com/track/...)"
					className="w-full p-4 text-black rounded-lg border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
					required
				/>

				<button
					type="button"
					onClick={fetchSongDetails}
					className={`w-full p-4 rounded-lg ${
						isFetching ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
					}`}
					disabled={isFetching}
				>
					{isFetching ? "Fetching..." : "Fetch Song Details"}
				</button>

				{songInfo && (
					<div className="space-y-4 text-center">
						<img
							src={songInfo.thumbnail}
							alt={songInfo.name}
							className="w-32 h-32 mx-auto rounded-lg shadow-lg"
						/>
						<h2 className="text-xl font-semibold">{songInfo.name}</h2>
					</div>
				)}

				<button
					type="submit"
					className={`w-full p-4 rounded-lg ${
						isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
					}`}
					disabled={isSubmitting}
				>
					{isSubmitting ? "Submitting..." : "Submit Song"}
				</button>
			</form>
		</div>
	);
};

export default MusicIntegration;
