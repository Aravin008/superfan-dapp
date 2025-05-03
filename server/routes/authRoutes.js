const express = require('express');
const router = express.Router();
const {getNonce, verifyUser, logout} = require('../controllers/authController');

// request nonce
router.post('/request-nonce', getNonce);

// Verify the user address with nonce to set token
router.post('/verify', verifyUser)

// Log out user delete token
router.post('/logout', logout);


module.exports = router;