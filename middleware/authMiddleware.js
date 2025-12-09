// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Needed if you want to attach user data
const Token = require('../models/Token'); // NEW: Import the Token model

// Use a placeholder secret (MUST be moved to environment variable)
const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY'; 

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // 1. Verify token signature (Standard JWT Check)
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // 2. CHECK MONGODB FOR ACTIVE SESSION (Replaces Redis Check)
            const activeSession = await Token.findOne({ 
                userId: decoded.id,
                tokenValue: token // Ensure the token value matches the stored session
            });

            if (!activeSession) {
                // If the token is not found in the DB, it means it was logged out or expired (TTL index deleted it).
                return res.status(401).json({ message: 'Not authorized, session expired or invalid.' });
            }

            // Attach user ID to the request
            req.userId = decoded.id; 
            next();

        } catch (error) {
            console.error(error);
            // This catches expired tokens, bad signatures, etc.
            res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

module.exports = protect;