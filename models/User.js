// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        // Enforcing security/prepared statement equivalent by strict schema
    },
    password: { // Stored as a hashed value
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('User', userSchema);