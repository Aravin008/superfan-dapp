const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  msgId: { type: String, required: true, unique: true, index: true },
  from: String,
  to: String,
  fromProfile: {
    name: { type: String },
    avatarUrl: { type: String }
  },
  toProfile: {
    name: { type: String },
    avatarUrl: { type: String }
  },
  text: String,
  tipAmountETH: String,
  tipAmountFAN: String,
  blockNumber: Number,
  txHash: String,
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null, index: true }
}, { timestamps: true });

module.exports = mongoose.model("Message", eventSchema);
