// server/controllers/authController.js
const User = require('../models/User');
const Profile = require('../models/Profile');
const Token = require('../models/Token'); // NEW: Import Token Model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY'; 

// Helper function to calculate expiration date (e.g., 1 hour from now)
const getExpirationDate = (hours) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
};

// --- Registration Logic (No Change from previous version) ---
exports.registerUser = async (req, res) => {
    // ... (Your existing registration code)
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = await User.create({ username, password: hashedPassword });
        await Profile.create({ userId: user._id });

        res.status(201).json({ message: 'User registered successfully. Profile created.', userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// --- Login Logic (UPDATED) ---
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        // Generate JWT (set to expire in 1 hour)
        const expiresInHours = 1;
        const expirationDate = getExpirationDate(expiresInHours);

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { 
            expiresIn: `${expiresInHours}h` 
        });
        
        // STORE SESSION IN MONGODB (Replaces Redis logic)
        // 1. Delete any existing active token for this user (log out old session)
        await Token.deleteOne({ userId: user._id });

        // 2. Create the new active session record
        await Token.create({
            userId: user._id,
            tokenValue: token,
            expiresAt: expirationDate
        });

        // Respond with the token to be stored in client's LocalStorage
        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// --- Logout Logic (UPDATED) ---
exports.logoutUser = async (req, res) => {
    try {
        // Find and delete the active token associated with the logged-in user (req.userId is from middleware)
        await Token.deleteOne({ userId: req.userId });
        res.json({ message: 'Logged out successfully (session invalidated on backend).' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed' });
    }
};