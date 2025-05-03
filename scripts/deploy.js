const hre = require("hardhat");

async function main() {
  const Guestbook = await hre.ethers.getContractFactory("Guestbook");
  const guestbook = await Guestbook.deploy();

  await guestbook.waitForDeployment();

  const address = await guestbook.getAddress();
  console.log("Guestbook deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
