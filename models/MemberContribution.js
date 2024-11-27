const mongoose = require('mongoose');

const memberContributionSchema = new mongoose.Schema({
  familyId: String,
  totalFamilyExpenses: Number,
  memberContributions: [
    {
      memberId: String,
      contribution: Number,
      percentage: String,
    },
  ],
  highestSpender: {
    memberId: String,
    amount: Number,
  },
});

module.exports = mongoose.model('MemberContribution', memberContributionSchema, 'memberContributions');
