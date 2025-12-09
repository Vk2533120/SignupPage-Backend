// server/config/db.js
const mongoose = require('mongoose');

// The MongoDB connection URI. 
// Note: In a real application, the URI should be stored in a .env file.
const MONGO_URI = 'mongodb+srv://vk2533120:5eT8M9fRm1xPS4Np@cluster0.6qftpfb.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0'; 

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;