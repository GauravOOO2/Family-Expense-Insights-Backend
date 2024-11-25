// Import required modules
const mongoose = require('mongoose');
const xlsx = require('xlsx');
require('dotenv').config(); // Load environment variables

// Import models
const Family = require('./models/Family'); // Family model
const Transaction = require('./models/Transaction'); // Transaction model

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

// Function to parse .xlsx file and populate MongoDB
const populateData = async () => {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile('family_financial_and_transactions_data.xlsx');

    // Parse Family Data (assuming the sheet name is 'Families')
    const familySheet = workbook.Sheets['Families'];
    const familyData = xlsx.utils.sheet_to_json(familySheet);

    // Insert Family Data into MongoDB
    for (const family of familyData) {
      const newFamily = new Family({
        familyId: family['Family ID'],
        income: family['Income'],
        savings: family['Savings'],
        monthlyExpenses: family['Monthly Expenses'],
        loanPayments: family['Loan Payments'],
        creditCardSpending: family['Credit Card Spending'],
        dependents: family['Dependents'],
        financialGoalsMet: family['Financial Goals Met (%)'],
      });
      await newFamily.save();
    }
    console.log('Family data populated successfully!');

    // Parse Transaction Data (assuming the sheet name is 'Transactions')
    const transactionSheet = workbook.Sheets['Transactions'];
    const transactionData = xlsx.utils.sheet_to_json(transactionSheet);

    // Insert Transaction Data into MongoDB
    for (const transaction of transactionData) {
      const newTransaction = new Transaction({
        familyId: transaction['Family ID'],
        memberId: transaction['Member ID'],
        transactionDate: new Date(transaction['Transaction Date']),
        category: transaction['Category'],
        amount: transaction['Amount'],
      });
      await newTransaction.save();
    }
    console.log('Transaction data populated successfully!');
  } catch (error) {
    console.error('Error populating data:', error.message);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
};

// Connect to MongoDB and populate data
connectDB().then(populateData);
