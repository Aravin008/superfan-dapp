const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  creator: String,
  title: String,
  description: String,
  date: String,
  blockNumber: Number,
  txHash: String,
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
