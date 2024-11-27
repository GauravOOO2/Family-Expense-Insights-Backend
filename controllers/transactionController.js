const Transaction = require('../models/Transaction');

// Add a transaction
const addTransaction = async (req, res) => {
  try {
    const { familyId, memberId, category, amount, transactionDate } = req.body;
    const newTransaction = new Transaction({ familyId, memberId, category, amount, transactionDate });
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction added successfully', transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error: error.message });
  }
};

module.exports = { addTransaction };
