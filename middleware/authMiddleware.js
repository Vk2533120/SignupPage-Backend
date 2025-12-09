// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Token = require('../models/Token'); 

const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY'; 

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, JWT_SECRET);
            
            const activeSession = await Token.findOne({ 
                userId: decoded.id,
                tokenValue: token 
            });

            if (!activeSession) {
                return res.status(401).json({ message: 'Not authorized, session expired or invalid.' });
            }

            req.userId = decoded.id; 
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

module.exports = protect;