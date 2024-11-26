const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
  familyId: { type: String, required: true },
  income: { type: Number, required: true },
  savings: { type: Number, required: true },
  monthlyExpenses: { type: Number, required: true },
  loanPayments: { type: Number, required: true },
  creditCardSpending: { type: Number, required: true },
  dependents: { type: Number, required: true },
  financialGoalsMet: { type: Number, required: true },
});

module.exports = mongoose.model('Family', FamilySchema);
