// Import required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Import models
const Transaction = require('./models/Transaction'); // Transaction model

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit with failure
  }
};

// Connect to MongoDB
connectDB();

// Add Transaction API
app.post('/api/transactions', async (req, res) => {
  const { familyId, memberId, transactionDate, category, amount } = req.body;

  try {
    // Create a new transaction
    const transaction = new Transaction({
      familyId,
      memberId,
      transactionDate: new Date(transactionDate),
      category,
      amount,
    });

    // Save to MongoDB
    await transaction.save();
    res.status(201).json({ message: 'Transaction added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add transaction', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
