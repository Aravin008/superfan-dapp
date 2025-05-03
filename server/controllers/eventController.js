const Event = require("../models/Event");
const EventNFT = require("../models/EventNFT");
const Message = require("../models/Message");

async function saveNewEventToDB(data) {
  try {
    const exists = await Event.findOne({ eventId: data.eventId });
    if (exists) return;

    const newEvent = new Event(data);
    await newEvent.save();
    console.log("✅ Event saved:", data.eventId);
  } catch (err) {
    console.error("❌ DB save error:", err);
  }
}

async function saveNFTEventToDB(data) {
  try {
    const exists = await EventNFT.findOne({ eventId: data.eventId });
    if (exists) return;

    const newEvent = new EventNFT(data);
    await newEvent.save();
    console.log("✅ EventNFT saved:", data.eventId);
  } catch (err) {
    console.error("❌ DB save error:", err);
  }
}


async function saveMessageToDB(data) {
  try {
    const exists = await Message.findOne({ msgId: data.msgId });
    if (exists) return;

    const newEvent = new Message(data);
    await newEvent.save();
    console.log("✅ Message saved:", data.msgId);
  } catch (err) {
    console.error("❌ DB save error:", err);
  }
}

module.exports = { saveNewEventToDB, saveNFTEventToDB, saveMessageToDB };
