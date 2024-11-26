const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  familyId: { type: String, required: true },
  memberId: { type: String, required: true },
  transactionDate: { type: Date, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
