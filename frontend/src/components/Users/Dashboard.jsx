import React from "react";
import TransactionChart from "../Transactions/TransactionChart";
import TransactionList from "../Transactions/TransactionList";
import RecurringExpenseList from "../RecurringExpenses/RecurringExpenseList";
import ExpenseAnalytics from "../Analytics/ExpenseAnalytics";
import BudgetAlerts from "../Budget/BudgetAlerts";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <BudgetAlerts />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionChart />
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a href="/add-transaction" className="block bg-blue-500 text-white p-3 rounded hover:bg-blue-600 text-center">
              Add Transaction / Recurring
            </a>
            <a href="/analytics" className="block bg-purple-500 text-white p-3 rounded hover:bg-purple-600 text-center">
              View Analytics
            </a>
            <a href="/budgets" className="block bg-green-500 text-white p-3 rounded hover:bg-green-600 text-center">
              Manage Budgets
            </a>
            <a href="/goals" className="block bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600 text-center">
              Financial Goals
            </a>
            <a href="/reports" className="block bg-gray-500 text-white p-3 rounded hover:bg-gray-600 text-center">
              Financial Reports
            </a>
          </div>
        </div>
      </div>
      <TransactionList />
      <RecurringExpenseList />
    </div>
  );
};

export default Dashboard;
