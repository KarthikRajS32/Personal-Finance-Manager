import React, { useState } from "react";
import CreateGoal from "./CreateGoal";
import GoalList from "./GoalList";
import FinancialForecast from "./FinancialForecast";

const GoalsDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("goals");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleGoalCreated = () => {
    setRefreshKey(prev => prev + 1);
    setShowCreateForm(false);
  };

  const tabs = [
    { id: "goals", label: "Goals", icon: "🎯" },
    { id: "forecast", label: "Forecast", icon: "📈" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Financial Goals & Forecasting</h1>
        {activeTab === "goals" && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showCreateForm ? "Cancel" : "Create Goal"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setShowCreateForm(false);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "goals" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {showCreateForm && (
            <div className="lg:col-span-1">
              <CreateGoal onGoalCreated={handleGoalCreated} />
            </div>
          )}
          
          <div className={showCreateForm ? "lg:col-span-1" : "lg:col-span-2"}>
            <GoalList refresh={refreshKey} />
          </div>
        </div>
      )}

      {activeTab === "forecast" && <FinancialForecast />}
    </div>
  );
};

export default GoalsDashboard;