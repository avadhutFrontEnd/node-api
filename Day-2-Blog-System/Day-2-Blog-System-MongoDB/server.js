const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Day-2-Blog-System - MongoDB API' });
});

// Start server
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
