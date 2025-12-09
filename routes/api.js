// server/routes/api.js
const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/profile', protect, getProfile); 
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logoutUser); 

module.exports = router;