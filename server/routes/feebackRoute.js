const express = require('express');
const router = express.Router();
const {createFeedback, getFeedbacks} = require('../controllers/feedbackController');

// Create or update profile
// router.post('/profile', createOrUpdateProfile);
router.post('/', createFeedback);

// Get public profile
// router.get('/profile/:walletId', getPublicProfile);
router.get('/', getFeedbacks);

module.exports = router;
