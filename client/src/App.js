import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import WriteMessagePage from "./components/WriteMessagePage";
import MusicIntegration from "./components/MusicIntegration";
import PhotoGallery from "./components/PhotoGallery";
import "./App.css";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} exact />
				<Route path="/write-message" element={<WriteMessagePage />} />
				<Route path="/dedicate-song" element={<MusicIntegration />} />
				<Route path="/photo-gallery" element={<PhotoGallery />} />
			</Routes>
		</Router>
	);
}

export default App;
