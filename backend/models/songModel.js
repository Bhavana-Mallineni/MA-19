const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
	username: { type: String, required: true },
	spotifyLink: { type: String, required: true },
	songName: { type: String, required: true },
	thumbnail: { type: String, required: true }
});

module.exports = mongoose.model("Song", songSchema);
