// server/models/Token.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // A user should only have one active token/session at a time
    },
    tokenValue: { // The JWT string itself
        type: String,
        required: true,
    },
    // The expiresAt field allows MongoDB to automatically clean up expired sessions
    expiresAt: {
        type: Date,
        required: true,
        // MongoDB TTL (Time To Live) index automatically deletes documents 
        // after the expiresAt date passes. This replaces Redis's auto-expiry.
        index: { expires: '0s' } 
    }
});

module.exports = mongoose.model('Token', tokenSchema);