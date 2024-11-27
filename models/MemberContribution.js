const mongoose = require('mongoose');

// Define schema for Member Contribution
const memberContributionSchema = new mongoose.Schema({
  totalExpenses: { type: Number, required: true },
  memberPercentages: [{
    memberId: { type: String, required: true },
    contribution: { type: Number, required: true },
    percentage: { type: String, required: true },
  }],
  highestSpender: {
    memberId: { type: String, required: true },
    amount: { type: Number, required: true }
  }
}, { timestamps: true });

const MemberContribution = mongoose.model('MemberContribution', memberContributionSchema);
module.exports = MemberContribution;
