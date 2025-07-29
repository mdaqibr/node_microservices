require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Basic Health Check
app.get('/', (req, res) => {
  res.send('User service is running');
});

module.exports = app;
