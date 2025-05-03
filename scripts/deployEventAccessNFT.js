// scripts/deployFanToken.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const EventAccessNFT = await ethers.getContractFactory("EventAccessNFT");
  const eventNFT = await EventAccessNFT.deploy('NFT_EVENT_CONTRACT_ADDRESS');

  await eventNFT.waitForDeployment();
  const address = await eventNFT.getAddress();

  console.log("EventAccessNFT deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
