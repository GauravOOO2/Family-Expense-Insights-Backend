const mongoose = require('mongoose');
const xlsx = require('xlsx');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const winston = require('winston');

// Advanced Logging Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/import-error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/import-combined.log' 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Load environment variables
dotenv.config();

// Enhanced MongoDB Connection with Retry Mechanism
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'family_expenses',
      retryWrites: true,
      w: 'majority'
    });
    logger.info('MongoDB Connected Successfully');
  } catch (error) {
    logger.error(`MongoDB Connection Error (${retries} retries left):`, error);
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }
    process.exit(1);
  }
};

// Family-Level Metrics Schema with Enhanced Validation
const FamilyMetricsSchema = new mongoose.Schema({
  familyId: { 
    type: String, 
    required: [true, 'Family ID is required'],
    unique: true,
    trim: true
  },
  income: { 
    type: Number, 
    required: [true, 'Income is required'],
    min: [0, 'Income must be a positive number']
  },
  savings: { 
    type: Number, 
    required: [true, 'Savings is required'],
    min: [0, 'Savings must be a non-negative number']
  },
  monthlyExpenses: { 
    type: Number, 
    required: [true, 'Monthly Expenses is required'],
    min: [0, 'Expenses must be a non-negative number']
  },
  loanPayments: { 
    type: Number, 
    required: [true, 'Loan Payments is required'],
    min: [0, 'Loan Payments must be a non-negative number']
  },
  creditCardSpending: { 
    type: Number, 
    required: [true, 'Credit Card Spending is required'],
    min: [0, 'Credit Card Spending must be a non-negative number']
  },
  dependents: { 
    type: Number, 
    required: [true, 'Number of Dependents is required'],
    min: [0, 'Dependents must be a non-negative number']
  },
  financialGoalsMet: { 
    type: Number, 
    required: [true, 'Financial Goals Met percentage is required'],
    min: [0, 'Financial Goals percentage must be between 0 and 100'],
    max: [100, 'Financial Goals percentage must be between 0 and 100']
  }
}, { 
  timestamps: true, 
  collection: 'family_metrics' 
});

// Transaction Schema with Enhanced Validation
const TransactionSchema = new mongoose.Schema({
  familyId: { 
    type: String, 
    required: [true, 'Family ID is required'],
    trim: true
  },
  memberId: { 
    type: String, 
    required: [true, 'Member ID is required'],
    trim: true
  },
  transactionDate: { 
    type: Date, 
    required: [true, 'Transaction Date is required'],
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Transaction date cannot be in the future'
    }
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'Groceries', 'Utilities', 'Rent', 'Transportation', 
      'Healthcare', 'Education', 'Entertainment', 'Other'
    ]
  },
  amount: { 
    type: Number, 
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be a positive number']
  }
}, { 
  timestamps: true, 
  collection: 'transactions' 
});

// Pre-save validations
FamilyMetricsSchema.pre('save', function(next) {
  if (this.income < this.monthlyExpenses) {
    next(new Error('Monthly expenses cannot exceed income'));
  }
  next();
});

TransactionSchema.pre('save', function(next) {
  if (this.amount > 100000) {
    next(new Error('Unusually high transaction amount'));
  }
  next();
});

// Create Models
const FamilyMetrics = mongoose.model('FamilyMetrics', FamilyMetricsSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// Enhanced Excel Import Function
async function importExcelData(filePath) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate file existence
    if (!fs.existsSync(filePath)) {
      throw new Error('Excel file not found');
    }

    // Read the workbook
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate required columns
    const requiredColumns = [
      'Family ID', 'Member ID', 'Transaction Date', 
      'Category', 'Amount', 'Income'
    ];
    const missingColumns = requiredColumns.filter(
      col => !Object.keys(data[0] || {}).includes(col)
    );

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Track unique family metrics to avoid duplicates
    const familyMetricsMap = new Map();
    const transactions = [];

    // Process each row with additional validation
    data.forEach(row => {
      // Validate row data
      if (!row['Family ID'] || !row['Member ID']) {
        logger.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
        return;
      }

      // Create transaction
      const transaction = {
        familyId: row['Family ID'],
        memberId: row['Member ID'],
        transactionDate: new Date(row['Transaction Date']),
        category: row['Category'],
        amount: parseFloat(row['Amount'])
      };
      
      // Validate transaction
      try {
        new Transaction(transaction).validateSync();
        transactions.push(transaction);
      } catch (validationError) {
        logger.warn(`Invalid transaction: ${validationError.message}`);
      }

      // Collect unique family metrics
      if (!familyMetricsMap.has(row['Family ID'])) {
        const familyMetrics = {
          familyId: row['Family ID'],
          income: parseFloat(row['Income']),
          savings: parseFloat(row['Savings']),
          monthlyExpenses: parseFloat(row['Monthly Expenses']),
          loanPayments: parseFloat(row['Loan Payments']),
          creditCardSpending: parseFloat(row['Credit Card Spending']),
          dependents: parseInt(row['Dependents']),
          financialGoalsMet: parseFloat(row['Financial Goals Met (%)'])
        };

        // Validate family metrics
        try {
          new FamilyMetrics(familyMetrics).validateSync();
          familyMetricsMap.set(row['Family ID'], familyMetrics);
        } catch (validationError) {
          logger.warn(`Invalid family metrics: ${validationError.message}`);
        }
      }
    });

    // Bulk write operations for better performance
    if (familyMetricsMap.size > 0) {
      const familyMetricsToInsert = Array.from(familyMetricsMap.values());
      await FamilyMetrics.deleteMany({});
      await FamilyMetrics.insertMany(familyMetricsToInsert, { session });
    }

    if (transactions.length > 0) {
      await Transaction.deleteMany({});
      await Transaction.insertMany(transactions, { 
        session, 
        ordered: false 
      });
    }

    await session.commitTransaction();

    logger.info(`Successfully imported:
    - ${familyMetricsMap.size} unique family metrics
    - ${transactions.length} transactions`);

    return {
      familyMetricsCount: familyMetricsMap.size,
      transactionsCount: transactions.length
    };
  } catch (error) {
    await session.abortTransaction();
    logger.error('Error importing Excel file:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

// Main function to run the import
async function main() {
  try {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }

    // Connect to MongoDB
    await connectDB();

    // Path to Excel file in root directory
    const excelFilePath = path.join(process.cwd(), 'family_financial_and_transactions_data.xlsx');
    
    // Import data
    const importResult = await importExcelData(excelFilePath);

    logger.info('Import Complete:', importResult);
  } catch (error) {
    logger.error('Error in main function:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
  }
}

// Export functions for potential use in other files
module.exports = {
  importExcelData,
  connectDB,
  FamilyMetrics,
  Transaction
};

// Run the import if script is called directly
if (require.main === module) {
  main();
}