const { getContract, getContractNFT, getContractNewMessage } = require("../utils/guestbookContract");
const { saveNewEventToDB, saveNFTEventToDB, saveMessageToDB } = require("../controllers/eventController");
const {ethers} = require('ethers');
const UserProfile = require('../models/UserProfile');
const Message = require('../models/Message');

function listenToNewEvent() {
  const contract = getContract();
  const contractNFT = getContractNFT();
  const contractMessage = getContractNewMessage();

  console.log("👂 Listening for NewEvent...");

  contract.on("EventCreated", async (eventId, creator, title, description, date, event) => {
    console.log("📥 NewEvent received:", { eventId, creator, title, description, date });

    await saveNewEventToDB({
      eventId: eventId.toString(),
      creator: creator.toLowerCase(),
      title: title,
      description,
      date: String(date),
      blockNumber: event.blockNumber,
      txHash: event.transactionHash,
    });
  });

  contractNFT.on("NFTAccessEnabled", async (eventId, priceInETH, priceInFAN, uri, event) => {
    console.log("📥 New NFTAccessEnabled received:", { eventId, priceInETH, priceInFAN, uri });

    await saveNFTEventToDB({
      eventId: eventId.toString(),
      priceInETH: ethers.formatEther(priceInETH),
      priceInFAN: ethers.formatUnits(priceInFAN, 18),
      uri,
      blockNumber: event.blockNumber,
      txHash: event.transactionHash,
    });
  });

  // address indexed from, address indexed to, string text, uint256 tipAmountETH, uint256 tipAmountFAN
  contractMessage.on("NewMessage", async ( from, to, msgId, text, tipAmountETH, tipAmountFAN, replyToMsgId, event) => {
    try {
      console.log("📥 NewMessage received:", {  from, to, msgId, text, tipAmountETH, tipAmountFAN, replyToMsgId });
  
      const [fromUser, toUser] = await Promise.all([
        UserProfile.findOne({ accountId: from.toLowerCase() }).lean(),
        UserProfile.findOne({ accountId: to.toLowerCase() }).lean()
      ]);

      const fromProfile = fromUser ? {
        name: fromUser.name,
        avatarUrl: fromUser.avatarUrl
      } : null;
  
      const toProfile = toUser ? {
        name: toUser.name,
        avatarUrl: toUser.avatarUrl
      } : null;

      let replyTo = null;
      if (!(ethers.getNumber(replyToMsgId) === 0)) {
        const parent = await Message.findOne({ msgId: Number(replyToMsgId) });
        if (parent) {
          replyTo = parent._id; // Set the MongoDB reference
        }
      }
  
      await saveMessageToDB({
        msgId: msgId.toString(),
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        fromProfile,
        toProfile,
        text,
        tipAmountETH: ethers.formatEther(tipAmountETH),
        tipAmountFAN: ethers.formatUnits(tipAmountFAN, 18),
        replyTo,
        blockNumber: event.blockNumber,
        txHash: event.transactionHash,
      });
  
    } catch (error) {
      console.error("🔥 Error handling NewMessage:", error);
    }
  });
}

module.exports = { listenToNewEvent };
