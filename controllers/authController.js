// server/controllers/authController.js
const User = require('../models/User');
const Profile = require('../models/Profile');
const Token = require('../models/Token'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY'; 

const getExpirationDate = (hours) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
};

exports.registerUser = async (req, res) => {
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

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const expiresInHours = 1;
        const expirationDate = getExpirationDate(expiresInHours);

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { 
            expiresIn: `${expiresInHours}h` 
        });
        
      
        await Token.deleteOne({ userId: user._id });

        await Token.create({
            userId: user._id,
            tokenValue: token,
            expiresAt: expirationDate
        });

        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        await Token.deleteOne({ userId: req.userId });
        res.json({ message: 'Logged out successfully (session invalidated on backend).' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed' });
    }
};