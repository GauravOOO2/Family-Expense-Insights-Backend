
# Family Expense Insights

A full-stack project designed to analyze family-level and member-level expenses efficiently, providing actionable insights. The application consists of a **backend (Node.js, Express, MongoDB)** and a **frontend (React Native with Expo)**, seamlessly integrated for robust performance.

---

## 🌟 **Features**

### Backend:
1. **Member Contribution Analysis**:
   - Calculates total family expenses.
   - Computes each member's contribution as a percentage of total expenses.
   - Identifies the highest spender in the family.

2. **Savings Optimization Logic**:
   - Suggests saving percentage based on income levels.
   - Evaluates overspending/underspending relative to an ideal expense-to-income ratio, considering:
     - Number of dependents.
     - Monthly expenses.
     - Income level.

3. **Add Transaction**:
   - Allows saving new transactions with details like:
     - Family ID
     - Member ID
     - Category
     - Amount
     - Transaction Date

### Frontend:
1. **Dashboard**:
   - Displays:
     - Total family expenses.
     - Member-wise contribution (percentage and amount).
     - Suggested saving percentage.
     - Family spending status (overspending/underspending).

2. **Add Transaction Form**:
   - Allows adding new transactions with the following fields:
     - Member
     - Category
     - Amount
     - Date

---

## 🛠 **Technology Stack**

### Backend:
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**

### Frontend:
- **React Native** with **Expo**
- **React Navigation**
- **Axios** (for API integration)
- **React Native Paper** (for UI components)

---

## 📂 **File Structure**

### Backend:
```
backend/
├── models/
│   ├── Transaction.js
│   ├── MemberContribution.js
│   └── SavingsOptimization.js
├── routes/
│   └── analysis.js
├── .env
├── server.js
└── package.json
```

### Frontend:
```
frontend/
├── assets/
├── components/
│   ├── Dashboard.js
│   ├── TransactionForm.js
├── screens/
│   ├── HomeScreen.js
│   └── AddTransactionScreen.js
├── App.js
├── api.js
└── package.json
```

---

## 🚀 **Setup Instructions**

### Backend:
1. Clone the repository:
   ```bash
   git clone https://github.com/GauravOOO2/Family-Expense-Insights-Backend.git
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. The backend will be running at `http://localhost:5000`.

---

### Frontend:
1. Navigate to the frontend directory:
   ```bash
   git clone https://github.com/GauravOOO2/Family-Expense-Insights-Frontend.git
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```
4. Use the Expo Go app or an Android emulator to test the app.

---

## 📊 **APIs**

### 1. Member Contribution Analysis
- **Endpoint**: `POST /api/analysis/member-contribution`
- **Input**: 
  ```json
  {
    "transactions": [
      {"memberId": "1", "amount": 100},
      {"memberId": "2", "amount": 200}
    ]
  }
  ```
- **Output**:
  ```json
  {
    "totalExpenses": 300,
    "memberPercentages": [
      {"memberId": "1", "contribution": 100, "percentage": "33.33"},
      {"memberId": "2", "contribution": 200, "percentage": "66.67"}
    ],
    "highestSpender": {"memberId": "2", "amount": 200}
  }
  ```

### 2. Savings Optimization
- **Endpoint**: `POST /api/analysis/savings-optimization`
- **Input**:
  ```json
  {
    "familyIncome": 50000,
    "savings": 10000,
    "totalExpenses": 30000,
    "dependents": 2,
    "monthlyExpenses": 1500
  }
  ```
- **Output**:
  ```json
  {
    "suggestedSavingPercentage": 20,
    "idealExpenseToIncomeRatio": "70.00%",
    "currentExpenseToIncomeRatio": "60.00%",
    "spendingStatus": "underspending"
  }
  ```

### 3. Add Transaction
- **Endpoint**: `POST /api/analysis/add-transaction`
- **Input**:
  ```json
  {
    "familyId": "123",
    "memberId": "1",
    "category": "Groceries",
    "amount": 100,
    "transactionDate": "2024-01-01"
  }
  ```
- **Output**:
  ```json
  {
    "message": "Transaction saved successfully!"
  }
  ```

---

## 🖥️ **Demo**
- **Backend**: [Deployed Backend Link](http://your-backend-url)
- **Frontend (Expo)**: [Expo App Link](https://expo.dev)

---

## 📚 **Documentation**
Refer to the uploaded assignment document for the complete details of the project requirements and logic.

---

## 🏆 **Evaluation Criteria**
- **Logic Complexity**: Efficient savings optimization and expense contribution algorithms.
- **Code Quality**: Modular, readable, and maintainable code.
- **Functionality**: Accurate insights on the dashboard.

---

## 🔗 **License**
This project is licensed under the MIT License.
