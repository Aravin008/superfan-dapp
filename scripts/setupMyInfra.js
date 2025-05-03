// scripts/setupInfra.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer, fanAccount] = await ethers.getSigners();

  console.log("Deployer address:", deployer.address);
  console.log("Fan account address:", fanAccount.address);

  // 1. Deploy FanToken
  const FanToken = await ethers.getContractFactory("FanToken");
  const fanToken = await FanToken.deploy(deployer.address);
  await fanToken.waitForDeployment();
  const fanTokenAddress = await fanToken.getAddress();
  console.log("FanToken deployed at:", fanTokenAddress);

  // 2. Deploy EventAccessNFT with FanToken address
  const EventAccessNFT = await ethers.getContractFactory("EventAccessNFT");
  const eventNFT = await EventAccessNFT.deploy(fanTokenAddress);
  await eventNFT.waitForDeployment();
  const eventAccessNFTAddress = await eventNFT.getAddress();
  console.log("EventNFT deployed at: ", eventAccessNFTAddress)

  // 3. Deploy GuestbookWithTips with FanToken address
  const Guestbook = await ethers.getContractFactory("GuestbookWithTips");
  const guestbook = await Guestbook.deploy(fanTokenAddress, eventAccessNFTAddress);
  await guestbook.waitForDeployment();
  const guestbookAddress = await guestbook.getAddress();
  console.log("GuestbookWithTips deployed at:", guestbookAddress);

  // 4. Register deployer as creator (if needed)
  // const creatorTx = await guestbook.registerAsCreator();
  // await creatorTx.wait();
  // console.log("Deployer is Creator - registered.");

  // 5. Transfer 1000 FAN tokens to fanAccount
  const transferAmount = ethers.parseUnits("1000", 18);
  const transferTx = await fanToken.transfer(fanAccount.address, transferAmount);
  await transferTx.wait();
  console.log(`Transferred 1000 FAN to fan account (${fanAccount.address})`);

  // // 6. Fan approves Guestbook to spend tokens
  // const fanTokenConnected = fanToken.connect(fanAccount);
  // const approveAmount = ethers.parseUnits("10", 18);
  // const approveTx = await fanTokenConnected.approve(guestbook.target, approveAmount);
  // await approveTx.wait();
  // console.log("Fan approved Guestbook to spend 10 FAN.");

  // // Optional: Check allowance
  // const allowance = await fanToken.allowance(fanAccount.address, guestbook.target);
  // console.log("Guestbook's allowance from Fan:", allowance.toString());

  // ✅ All set up!
  console.log("\n✅ Setup complete. You can now interact with your contracts!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
