const express = require("express");
const axios = require("axios");
const Song = require("../models/songModel");
require("dotenv").config();

const router = express.Router();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID; // Replace with your Spotify Client ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET; // Replace with your Spotify Client Secret

const getSpotifyAccessToken = async () => {
	try {
		const authHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
			"base64"
		);
		const response = await axios.post(
			"https://accounts.spotify.com/api/token",
			new URLSearchParams({ grant_type: "client_credentials" }),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${authHeader}`
				}
			}
		);
		return response.data.access_token;
	} catch (error) {
		console.error("Error fetching Spotify access token:", error.response?.data || error.message);
		throw new Error("Failed to fetch Spotify access token");
	}
};

router.post("/fetch", async (req, res) => {
	const { spotifyLink } = req.body;

	if (!spotifyLink) {
		return res.status(400).json({ success: false, message: "Spotify link is required." });
	}

	try {
		const spotifyId = spotifyLink.split("/track/")[1]?.split("?")[0];

		if (!spotifyId) {
			return res.status(400).json({ success: false, message: "Invalid Spotify link." });
		}

		const accessToken = await getSpotifyAccessToken();
		const response = await axios.get(`https://api.spotify.com/v1/tracks/${spotifyId}`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		const { name, album } = response.data;
		const thumbnail = album.images[0]?.url;

		if (!name || !thumbnail) {
			return res.status(400).json({ success: false, message: "Failed to fetch song details." });
		}

		res.json({ name, thumbnail });
	} catch (error) {
		console.error("Error fetching song details:", error.response?.data || error.message);
		res.status(500).json({ success: false, message: "Failed to fetch song details." });
	}
});

router.post("/", async (req, res) => {
	const { username, spotifyLink, songName, thumbnail } = req.body;

	if (!username || !spotifyLink || !songName || !thumbnail) {
		return res
			.status(400)
			.json({ success: false, message: "All fields are required to submit a song." });
	}

	try {
		const newSong = new Song({ username, spotifyLink, songName, thumbnail });
		await newSong.save();
		res.status(201).json({ success: true, data: newSong });
	} catch (error) {
		console.error("Error saving song:", error.message);
		res.status(500).json({ success: false, message: "Failed to save song." });
	}
});

module.exports = router;
