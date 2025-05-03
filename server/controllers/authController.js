// const Feedback = require('../models/Feedback');
const {ethers} = require('ethers');
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const CustomError = require('../utils/CustomErrors'); // optional helper for throwing errors
const JWT_SECRET = process.env.JWT_SECRET;

let nonceStore = {}; // replace with Redis/DB in production

const getNonce = (req, res) => {
  if (!req.body || !req.body.address) {
    throw new CustomError("Address is missing.", 400);
  }

  const { address } = req.body;

  if (!ethers.isAddress(address)) {
    throw new CustomError("Not a valid Address.", 400);
  }

  const parsedAddress = ethers.getAddress(address); // checksum

  const nonce = `Sign this message to verify: ${Math.floor(Math.random() * 1000000)}`;
  nonceStore[parsedAddress.toLowerCase()] = nonce;

  res.json({ nonce });
};

const verifyUser = (req, res) => {
  const { address, message, signature } = req.body;

  const expectedNonce = nonceStore[address.toLowerCase()];
  if (expectedNonce !== message) return res.status(400).json({ error: 'Invalid nonce' });

  const recoveredAddress = ethers.verifyMessage(message, signature);
  if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    return res.status(401).json({ error: 'Signature verification failed' });
  }

  // Clear nonce to prevent reuse
  delete nonceStore[address.toLowerCase()];

  const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: "7d" });

  // Set HttpOnly cookie
  const isProduction = process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", cookie.serialize("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "lax" : "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }));

  // Return public profile
  res.status(200).json({ address });
};

const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "lax" : "none",
      path: "/",
      maxAge: 0, // delete immediately
    })
  );

  res.status(200).json({ message: "Logged out" });
}


module.exports = {
  getNonce,
  verifyUser,
  logout
};
