import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WriteMessagePage = () => {
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const userName = localStorage.getItem("userName");

	useEffect(() => {
		if (!userName) {
			alert("Username is missing. Please return to the home page and enter your name.");
			navigate("/");
		}
	}, [userName, navigate]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		formData.append("username", userName);
		formData.append("name", name);
		formData.append("message", message);
		if (image) formData.append("image", image);

		try {
			await axios.post("http://localhost:3000/api/messages/save", formData, {
				headers: { "Content-Type": "multipart/form-data" }
			});
			alert("Message successfully submitted!");
			navigate("/");
		} catch (error) {
			console.error("Error submitting message", error);
			alert("Failed to submit the message. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className={`min-h-screen flex flex-col items-center justify-center p-4 ${
				loading ? "opacity-75" : ""
			} bg-gradient-to-b from-yellow-200 to-pink-300`}
		>
			{loading && (
				<div className="absolute flex items-center justify-center top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10">
					<div className="w-12 h-12 border-4 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}

			<h1 className="text-3xl font-bold mb-6 text-purple-800">Write a message for Asritha</h1>

			<form
				onSubmit={handleSubmit}
				className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg space-y-6"
			>
				<div className="space-y-4">
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="FROM (Name / NickName) "
						className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
						disabled={loading}
						required
					/>

					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Write your message here..."
						rows="6"
						className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
						disabled={loading}
						required
					/>
				</div>

				<div className="space-y-2">
					<label className="font-semibold">
						Image to be displayed with your message (Optional):
					</label>
					<input
						type="file"
						onChange={handleImageChange}
						className="w-full p-2 border rounded-lg"
						disabled={loading}
					/>
				</div>

				<button
					type="submit"
					className={`w-full p-4 text-white rounded-lg ${
						loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
					}`}
					disabled={loading}
				>
					{loading ? "Submitting..." : "Submit Message"}
				</button>
			</form>
		</div>
	);
};

export default WriteMessagePage;
