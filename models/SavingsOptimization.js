const mongoose = require('mongoose');

const savingsOptimizationSchema = new mongoose.Schema({
  familyId: { type: String, required: true },
  familyIncome: { type: Number, required: true },
  savings: { type: Number, required: true },
  totalExpenses: { type: Number, required: true },
  suggestedSavingPercentage: { type: Number, required: true },
  idealExpenseToIncomeRatio: { type: String, required: true },
  currentExpenseToIncomeRatio: { type: String, required: true },
  spendingStatus: { type: String, required: true },
});

module.exports = mongoose.model('SavingsOptimization', savingsOptimizationSchema);
