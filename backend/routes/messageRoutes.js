const express = require("express");
const multer = require("multer");
const heicConvert = require("heic-convert");
const Message = require("../models/messageModel");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/save", upload.single("image"), async (req, res) => {
	const { username, name, message } = req.body;

	if (!username || !name || !message) {
		return res
			.status(400)
			.json({ success: false, message: "Username, name, and message are required." });
	}

	let imageBuffer = null;

	// Convert HEIC/HEIF images to JPEG if necessary
	if (req.file) {
		if (req.file.mimetype === "image/heic" || req.file.mimetype === "image/heif") {
			try {
				imageBuffer = await heicConvert({
					buffer: req.file.buffer,
					format: "JPEG",
					quality: 1
				});
			} catch (error) {
				return res
					.status(500)
					.json({ success: false, message: "Error converting HEIC image to JPEG." });
			}
		} else {
			imageBuffer = req.file.buffer;
		}
	}

	try {
		const newMessage = new Message({
			username,
			name,
			message,
			image: imageBuffer ? imageBuffer.toString("base64") : null
		});
		await newMessage.save();

		res.status(201).json({ success: true, data: newMessage });
	} catch (error) {
		console.error("Error saving message:", error);
		res.status(500).json({ success: false, message: "Server error. Could not save message." });
	}
});

module.exports = router;
