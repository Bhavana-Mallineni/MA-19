const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
	username: { type: String, required: true },
	url: { type: String, required: true },
	caption: { type: String, default: "" },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Photo", photoSchema);
