// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FanToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("FanToken", "FAN") Ownable(initialOwner) {
      // Mint 1 million tokens to the deployer (platform owner)
      _mint(initialOwner, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
