// server/routes/api.js
const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes (Register/Login)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (Profile)
// All these routes use the `protect` middleware to check localstorage/JWT/Redis
router.get('/profile', protect, getProfile); 
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logoutUser); // Optional but recommended

module.exports = router;