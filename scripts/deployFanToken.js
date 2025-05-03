// scripts/deployFanToken.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const FanToken = await ethers.getContractFactory("FanToken");
  const fanToken = await FanToken.deploy(deployer.address);

  await fanToken.waitForDeployment();
  const address = await fanToken.getAddress();

  console.log("FanToken deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
