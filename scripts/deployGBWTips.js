// scripts/deployGuestbookWithTips.js
const { ethers } = require("hardhat");
// const {FAN_TOKEN_ADDRESS} = require('../client/src/constants/constants');

async function main() {
  const [deployer] = await ethers.getSigners();

  // Replace with your deployed FanToken contract address
  const fanTokenAddress = 'FAN_TOKEN_CONTRACT_ADDRESS';
  const eventNFTAccessAddress = 'NFT_TOKEN_CONTRACT_ADDRESS';

  const GuestbookWithTips = await ethers.getContractFactory("GuestbookWithTips");
  const guestbook = await GuestbookWithTips.deploy(fanTokenAddress, eventNFTAccessAddress);

  await guestbook.waitForDeployment();

  const address = await guestbook.getAddress();
  console.log("GuestbookWithTips deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
