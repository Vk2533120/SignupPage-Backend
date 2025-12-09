// server/server.js


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const apiRoutes = require('./routes/api');


const app = express();
const PORT = 5000;
console.log("hello",PORT);

// Middleware
app.use(cors());
app.use(express.json()); 

mongoose.connect('mongodb+srv://vk2533120:5eT8M9fRm1xPS4Np@cluster0.6qftpfb.mongodb.net/Users?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});