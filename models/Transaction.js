const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  familyId: { type: String, required: true },
  memberId: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionDate: { type: Date, required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);
