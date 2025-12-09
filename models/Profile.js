// server/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
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
    timestamps: true 
});

module.exports = mongoose.model('Profile', profileSchema);