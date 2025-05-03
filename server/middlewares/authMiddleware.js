// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomErrors");
const JWT_SECRET = process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new CustomError("Unauthorized", 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = requireAuth;
