import React, { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";

const PhotoGallery = () => {
	const [photos, setPhotos] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);
	const [caption, setCaption] = useState("");
	const [uploadMessage, setUploadMessage] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [viewerIndex, setViewerIndex] = useState(null); // For fullscreen viewer
	const navigate = useNavigate();

	const userName = localStorage.getItem("userName");

	useEffect(() => {
		axios
			.get("http://localhost:3000/api/photos")
			.then((response) => {
				setPhotos(response.data);
			})
			.catch((error) => {
				console.error("Error fetching photos:", error);
			});
	}, []);

	useEffect(() => {
		if (!userName) {
			alert("Username is missing. Please return to the home page and enter your name.");
			navigate("/");
		}
	}, [userName, navigate]);

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			try {
				const options = {
					maxSizeMB: 1,
					maxWidthOrHeight: 1024,
					useWebWorker: true
				};
				const compressedFile = await imageCompression(file, options);
				const reader = new FileReader();
				reader.onload = () => {
					setSelectedFile({ file: compressedFile, preview: reader.result });
				};
				reader.readAsDataURL(compressedFile);
			} catch (error) {
				console.error("Error compressing image:", error);
			}
		}
	};

	const handleCaptionChange = (e) => {
		setCaption(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!selectedFile) {
			setUploadMessage("Please select a photo.");
			return;
		}

		setIsUploading(true); // Set uploading to true
		const formData = new FormData();
		formData.append("username", userName);
		formData.append("photo", selectedFile.file);
		formData.append("caption", caption);

		axios
			.post("http://localhost:3000/api/photos", formData)
			.then((response) => {
				setPhotos([...photos, response.data]);
				setSelectedFile(null);
				setCaption("");
				setUploadMessage("Photo uploaded successfully!");
			})
			.catch((error) => {
				console.error("Error uploading photo:", error);
				setUploadMessage("Error uploading photo. Please try again.");
			})
			.finally(() => {
				setIsUploading(false); // Set uploading to false once done
			});
	};

	const openViewer = (index) => {
		setViewerIndex(index);
	};

	const closeViewer = () => {
		setViewerIndex(null);
	};

	const nextPhoto = () => {
		if (viewerIndex !== null && viewerIndex < photos.length - 1) {
			setViewerIndex(viewerIndex + 1);
		}
	};

	const prevPhoto = () => {
		if (viewerIndex !== null && viewerIndex > 0) {
			setViewerIndex(viewerIndex - 1);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-950 via-purple-950 to-orange-950 text-white flex flex-col items-center p-6 relative">
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
				{[...Array(30)].map((_, index) => (
					<div
						key={index}
						className="bg-white w-1 h-1 rounded-full absolute opacity-75 animate-pulse"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`
						}}
					></div>
				))}
			</div>

			<h1 className="text-4xl font-bold mb-6">Frame the Memories 📸</h1>
			<p className="text-lg mb-6">
				Share photos that hold special memories and build an unforgettable gallery for Asritha!
			</p>

			<form
				onSubmit={handleSubmit}
				className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 p-6 rounded-lg w-full max-w-md mb-6 shadow-2xl"
			>
				{selectedFile && (
					<div className="mb-4">
						<img src={selectedFile.preview} alt="Preview" className="w-full rounded-lg shadow-md" />
					</div>
				)}
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="w-full mb-4 text-white bg-transparent border border-gray-400 rounded-lg p-2"
				/>
				<textarea
					value={caption}
					onChange={handleCaptionChange}
					placeholder="Add a caption (optional)"
					className="w-full mb-4 h-24 text-black p-2 border border-gray-400 rounded-lg"
				></textarea>
				<button
					type="submit"
					className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg w-full"
					disabled={isUploading}
				>
					{isUploading ? "Uploading..." : "Upload Photo"}
				</button>
				{uploadMessage && <p className="text-sm mt-2">{uploadMessage}</p>}
			</form>

			<div className="grid grid-cols-4 gap-2">
				{photos.map((photo, index) => (
					<div
						key={index}
						className="cursor-pointer transition transform hover:scale-105"
						onClick={() => openViewer(index)}
					>
						<img
							src={photo.url}
							alt="memory"
							className="rounded-lg shadow-lg w-full object-cover"
							style={{ height: "200px" }}
						/>
					</div>
				))}
			</div>

			{/* Fullscreen Viewer */}
			{viewerIndex !== null && (
				<div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
					<div className="relative max-w-4xl w-full p-4">
						<img
							src={photos[viewerIndex].url}
							alt="Selected memory"
							className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
						/>
						{photos[viewerIndex].caption && (
							<p className="text-white text-lg font-semibold mt-4 text-center">
								{photos[viewerIndex].caption}
							</p>
						)}
						<button
							onClick={closeViewer}
							className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-3 hover:bg-gray-600"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						<button
							onClick={prevPhoto}
							className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600"
						>
							&#8592;
						</button>
						<button
							onClick={nextPhoto}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600"
						>
							&#8594;
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default PhotoGallery;
