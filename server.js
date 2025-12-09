// server/server.js
console.log("hello");

const express = require('express');
console.log("hello1");

const mongoose = require('mongoose');
console.log("hello2");

const cors = require('cors');
console.log("hello3");

const apiRoutes = require('./routes/api');
console.log("hello4");

const app = express();
const PORT = 5000;
console.log("hello",PORT);

// Middleware
app.use(cors());
app.use(express.json()); 

mongoose.connect('mongodb+srv://vk2533120:5eT8M9fRm1xPS4Np@cluster0.6qftpfb.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});