const mongoose = require('mongoose');

// Define schema for Savings Optimization
const savingsOptimizationSchema = new mongoose.Schema({
  familyIncome: { type: Number, required: true },
  savings: { type: Number, required: true },
  totalExpenses: { type: Number, required: true },
  dependents: { type: Number, required: true },
  monthlyExpenses: { type: Number, required: true },
  suggestedSavingPercentage: { type: Number, required: true },
  idealExpenseToIncomeRatio: { type: String, required: true },
  currentExpenseToIncomeRatio: { type: String, required: true },
  spendingStatus: { type: String, required: true }
}, { timestamps: true });

const SavingsOptimization = mongoose.model('SavingsOptimization', savingsOptimizationSchema);
module.exports = SavingsOptimization;
