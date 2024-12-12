const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	username: { type: String, required: true },
	name: { type: String, required: true },
	message: { type: String, required: true },
	image: { type: Buffer } // Store image filename
});

module.exports = mongoose.model("Message", messageSchema);
