// server/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    // Link to the User model, ensuring one profile per user
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    age: { type: Number, default: null },
    dob: { type: Date, default: null },
    contact: { type: String, default: null }
}, { 
    timestamps: true // Added for useful tracking
});

module.exports = mongoose.model('Profile', profileSchema);