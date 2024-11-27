const express = require('express');
const router = express.Router();
const MemberContribution = require('../models/MemberContribution'); // Import model

// Endpoint: Member Contribution Analysis
router.post('/member-contribution', (req, res) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ message: 'Invalid or missing transactions data.' });
    }

    // Calculate total family expenses
    const totalExpenses = transactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Calculate each member's contribution
    const memberContributions = {};
    transactions.forEach((txn) => {
      if (!memberContributions[txn.memberId]) {
        memberContributions[txn.memberId] = 0;
      }
      memberContributions[txn.memberId] += txn.amount;
    });

    // Calculate percentages and find the highest spender
    let highestSpender = { memberId: null, amount: 0 };
    const memberPercentages = Object.keys(memberContributions).map((memberId) => {
      const contribution = memberContributions[memberId];
      if (contribution > highestSpender.amount) {
        highestSpender = { memberId, amount: contribution };
      }
      return {
        memberId,
        contribution,
        percentage: ((contribution / totalExpenses) * 100).toFixed(2), // Rounded to 2 decimal places
      };
    });

    // Response data
    res.json({
      totalExpenses,
      memberPercentages,
      highestSpender,
    });
  } catch (error) {
    console.error('Error analyzing member contributions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Endpoint: Savings Optimization Logic
router.post('/savings-optimization', (req, res) => {
    try {
      const { familyIncome, savings, totalExpenses, dependents, monthlyExpenses } = req.body;
  
      // Validate input
      if (!familyIncome || !savings || !totalExpenses || dependents === undefined || !monthlyExpenses) {
        return res.status(400).json({ message: 'Missing required fields in the input data.' });
      }
  
      // Suggested saving percentage based on income
      let suggestedSavingPercentage = 15; // Default
      if (familyIncome > 200000) {
        suggestedSavingPercentage = 25; // High income
      } else if (familyIncome > 100000) {
        suggestedSavingPercentage = 20; // Moderate income
      } else if (familyIncome > 50000) {
        suggestedSavingPercentage = 10; // Low income
      }
  
      // Ideal expense-to-income ratio
      const baseRatio = 0.5; // Base ratio for 1 dependent
      const dependentsFactor = dependents * 0.05; // Add 5% per dependent
      const monthlyFactor = monthlyExpenses / familyIncome; // Monthly expenses impact
      const idealRatio = baseRatio + dependentsFactor + monthlyFactor;
  
      // Current expense-to-income ratio
      const currentRatio = totalExpenses / familyIncome;
  
      // Determine overspending or underspending
      const spendingStatus =
        currentRatio > idealRatio
          ? 'overspending'
          : currentRatio < idealRatio
          ? 'underspending'
          : 'balanced';
  
      // Response
      res.json({
        familyIncome,
        savings,
        totalExpenses,
        suggestedSavingPercentage,
        idealExpenseToIncomeRatio: (idealRatio * 100).toFixed(2) + '%',
        currentExpenseToIncomeRatio: (currentRatio * 100).toFixed(2) + '%',
        spendingStatus,
      });
    } catch (error) {
      console.error('Error in savings optimization logic:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  const Transaction = require('../models/Transaction'); // Import the Transaction model

  // Endpoint: Add Transaction
  router.post('/add-transaction', async (req, res) => {
    try {
      const { familyId, memberId, category, amount, transactionDate } = req.body;
  
      // Validate input
      if (!familyId || !memberId || !category || !amount || !transactionDate) {
        return res.status(400).json({ message: 'Missing required fields in input data.' });
      }
  
      // Save transaction in MongoDB
      const newTransaction = new Transaction({
        familyId,
        memberId,
        category,
        amount,
        transactionDate,
      });
  
      await newTransaction.save();
  
      res.status(201).json({
        message: 'Transaction saved successfully!',
        transaction: newTransaction,
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


module.exports = router;
