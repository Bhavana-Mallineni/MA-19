const express = require("express");
const multer = require("multer");
const heicConvert = require("heic-convert");

const Photo = require("../models/photoModel");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to upload a photo
router.post("/", upload.single("photo"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "Photo file is required." });
		}

		let photoBuffer = req.file.buffer;

		// Convert HEIC/HEIF to JPEG
		if (req.file.mimetype === "image/heic" || req.file.mimetype === "image/heif") {
			try {
				photoBuffer = await heicConvert({
					buffer: req.file.buffer,
					format: "JPEG",
					quality: 1
				});
			} catch (conversionError) {
				return res.status(500).json({ error: "Error converting HEIC image to JPEG." });
			}
		}

		// Generate Base64 URL for image
		const photoUrl = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;
		const { username, caption } = req.body;
		console.log(req.body);

		// Save photo to database
		const newPhoto = new Photo({ username, url: photoUrl, caption });
		await newPhoto.save();

		res.status(201).json(newPhoto);
	} catch (error) {
		res.status(500).json({ error: "Error uploading photo." });
	}
});

// Endpoint to get all photos
router.get("/", async (req, res) => {
	try {
		const photos = await Photo.find().sort({ createdAt: -1 });
		res.json(photos);
	} catch (error) {
		console.error("Error fetching photos:", error);
		res.status(500).json({ error: "Error fetching photos." });
	}
});

module.exports = router;
