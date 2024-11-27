const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const analysisRoutes = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// MongoDB connection function
const connectDB = async () => {
  try {
    const dbUri = process.env.MONGO_URI;
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB: Family_expense_track_db');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/analysis', require('./routes/analysis')); // Correct API route

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
