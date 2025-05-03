// scripts/transferTokens.js

const { ethers } = require("hardhat");

async function main() {
  // Get the signers (deployer and fan)
  const [deployer, fan1, fan2] = await ethers.getSigners();

  // Get the deployed FanToken contract
  const fanTokenAddress = "FAN_TOKEN_CONTRACT_ADDRESS"; // Replace with your deployed FanToken contract address
  const fanToken = await ethers.getContractAt("FanToken", fanTokenAddress);

  // Amount of FAN tokens to transfer
  const amount = ethers.parseUnits("1000", 18); // 1000 FAN tokens (18 decimals)

  console.log("Transferring 1000 FAN tokens from deployer to fan...");

  // Transfer FAN tokens from deployer to fan
  const tx = await fanToken.transfer(fan2.address, amount);
  await tx.wait();

  console.log(`Transferred 1000 FAN tokens to ${fan2.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
