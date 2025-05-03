const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  priceInETH: String,
  priceInFAN: String,
  uri: String,
  blockNumber: Number,
  txHash: String,
}, { timestamps: true });

module.exports = mongoose.model("EventNFT", eventSchema);
