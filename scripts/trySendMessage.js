// scripts/sendMessage.js
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = 'SUPERFAN_APP_CONTRACT_ADDRESS'; // <- Replace this
  const fanTokenAddress = "FAN_TOKEN_CONTRACT_ADDRESS"; // <- Replace this

  const [recipient, sender] = await ethers.getSigners(); // This will be msg.sender
  // const recipient = deployer; // <- Replace this with a registered creator address

  const contract = await ethers.getContractAt("GuestbookWithTips", contractAddress);
  const fanToken = await ethers.getContractAt("IERC20", fanTokenAddress);

  const messageText = "Hey! Loved your event!";
  const fanTipAmount = ethers.parseUnits("10", 18); // Assuming FAN has 18 decimals
  const ethTipAmount = ethers.parseEther("0.01"); // Tip 0.01 ETH

 // FAN token contract instance with the sender
  const fanTokenConnected = fanToken.connect(sender);
  const allowance = await fanTokenConnected.allowance(recipient, contractAddress);
  // const approveTx = await fanTokenConnected.approve(contract.target, fanTipAmount);
  // await approveTx.wait();
  const allowanceAfter = await fanTokenConnected.allowance(recipient, contractAddress);
  console.log("FAN token approved.", allowance, allowanceAfter);

  // ✅ Send message with tips
  const tx = await contract.connect(sender).sendMessage(
    recipient.address, // recipient
    "Hello creator!", // message
    ethers.parseUnits("1", 18), // FAN tip amount
    { value: ethers.parseEther("0") } // ETH tip
  );
  await tx.wait();
  console.log("Message sent!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
