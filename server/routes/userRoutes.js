const express = require('express');
const router = express.Router();
const {createOrUpdateProfile, getPublicProfile, getMe, getCreators} = require('../controllers/userController');
const requireAuth = require('../middlewares/authMiddleware');

// Create or update profile
router.post('/profile', createOrUpdateProfile);

// Get public profile
router.get('/profile/:walletId', getPublicProfile);

// Get Current user details
router.get('/me', requireAuth, getMe);

router.get("/creators", getCreators);


module.exports = router;
