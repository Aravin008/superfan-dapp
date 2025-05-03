const { ethers, Network, JsonRpcProvider } = require("ethers");

const hardhatNetwork = new Network("hardhat", 31337);

// 👇 Note: Use staticNetwork to prevent auto-detection that tries ENS
const provider = new JsonRpcProvider(process.env.RPC_URL, hardhatNetwork, {
  staticNetwork: true // <-- Critical to disable ENS fetch
});

const CONTRACT_ADDRESS = process.env.GUESTBOOK_ADDRESS;

function getContract() {
  const ABI = [
    "event EventCreated( uint256 indexed eventId, address indexed creator, string title, string description, uint256 date)"
  ];
  if (!CONTRACT_ADDRESS || !ethers.isAddress(CONTRACT_ADDRESS)) {
    throw new Error("Invalid CONTRACT_ADDRESS. Check your .env or config.");
  }
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

function getContractNFT() {
  const ABI = [
    "event NFTAccessEnabled(uint256 indexed eventId, uint256 priceInETH, uint256 priceInFAN, string uri)"
  ];
  if (!CONTRACT_ADDRESS || !ethers.isAddress(CONTRACT_ADDRESS)) {
    throw new Error("Invalid CONTRACT_ADDRESS. Check your .env or config.");
  }
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

function getContractNewMessage() {
  const ABI = [
    "event NewMessage(address indexed from, address indexed to, uint256 msgId, string text, uint256 tipAmountETH, uint256 tipAmountFAN, uint256 replyToMsgId)"
  ];
  if (!CONTRACT_ADDRESS || !ethers.isAddress(CONTRACT_ADDRESS)) {
    throw new Error("Invalid CONTRACT_ADDRESS. Check your .env or config.");
  }
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

module.exports = { getContract, getContractNFT, getContractNewMessage };
