const { ethers } = require("hardhat");

async function listAccounts() {
  const accounts = await ethers.getSigners();
  accounts.forEach((acc, idx) => {
    console.log(`Account ${idx}: ${acc.address}`);
  });
}

listAccounts();