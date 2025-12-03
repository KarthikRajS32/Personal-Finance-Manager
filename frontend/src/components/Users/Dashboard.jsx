import React from "react";
import { FaPlus, FaChartLine, FaWallet, FaBullseye, FaFileAlt, FaBell, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import TransactionChart from "../Transactions/TransactionChart";
import TransactionList from "../Transactions/TransactionList";
import BudgetAlerts from "../Budget/BudgetAlerts";

const Dashboard = () => {
  const quickActions = [
    { name: "Add Transaction", href: "/add-transaction", icon: FaPlus, color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Budgets", href: "/budgets", icon: FaWallet, color: "bg-green-600 hover:bg-green-700" },
    { name: "Goals", href: "/goals", icon: FaBullseye, color: "bg-purple-600 hover:bg-purple-700" },
    { name: "Reports", href: "/reports", icon: FaFileAlt, color: "bg-indigo-600 hover:bg-indigo-700" },
    { name: "Recurring", href: "/recurring-expenses", icon: FaChartLine, color: "bg-orange-600 hover:bg-orange-700" },
    { name: "Notifications", href: "/notifications", icon: FaBell, color: "bg-red-600 hover:bg-red-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full -translate-y-16 translate-x-16 opacity-10"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Financial Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Take control of your financial future</p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <FaCalendarAlt className="mr-2" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Budget Alerts */}
        <BudgetAlerts />

        {/* Quick Actions Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4">
              <FaChartLine className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600">Manage your finances efficiently</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className={`${action.color} text-white p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group transform hover:-translate-y-1`}
              >
                <div className="text-center">
                  <action.icon className="mx-auto text-3xl mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-semibold">{action.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <TransactionChart />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-lg mr-3">
                <FaChartLine className="text-white text-lg" />
              </div>
              Financial Summary
            </h3>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-semibold">Total Income</span>
                  <span className="text-green-800 font-bold text-xl">$0.00</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-semibold">Total Expenses</span>
                  <span className="text-red-800 font-bold text-xl">$0.00</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-semibold">Net Savings</span>
                  <span className="text-blue-800 font-bold text-xl">$0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                <FaFileAlt className="text-white text-lg" />
              </div>
              Recent Transactions
            </h2>
            <p className="text-gray-600 mt-2">Track your latest financial activities</p>
          </div>
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
