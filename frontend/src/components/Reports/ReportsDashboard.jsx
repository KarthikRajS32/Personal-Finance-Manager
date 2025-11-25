import React, { useState } from "react";
import ExpenseReport from "./ExpenseReport";
import BudgetReport from "./BudgetReport";
import IncomeReport from "./IncomeReport";

const ReportsDashboard = () => {
  const [activeTab, setActiveTab] = useState("expense");

  const tabs = [
    { id: "expense", label: "Expense Reports", icon: "💸" },
    { id: "budget", label: "Budget Reports", icon: "📊" },
    { id: "income", label: "Income Reports", icon: "💰" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "expense":
        return <ExpenseReport />;
      case "budget":
        return <BudgetReport />;
      case "income":
        return <IncomeReport />;
      default:
        return <ExpenseReport />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Reports</h1>
        <p className="text-gray-600">
          Comprehensive analysis of your financial data with detailed insights and recommendations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ReportsDashboard;