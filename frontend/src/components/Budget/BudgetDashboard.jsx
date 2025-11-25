import React, { useState } from "react";
import CreateBudget from "./CreateBudget";
import BudgetList from "./BudgetList";
import BudgetAlerts from "./BudgetAlerts";

const BudgetDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleBudgetCreated = () => {
    setRefreshKey(prev => prev + 1);
    setShowCreateForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Budget Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showCreateForm ? "Cancel" : "Create Budget"}
        </button>
      </div>

      <BudgetAlerts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showCreateForm && (
          <div className="lg:col-span-1">
            <CreateBudget onBudgetCreated={handleBudgetCreated} />
          </div>
        )}
        
        <div className={showCreateForm ? "lg:col-span-1" : "lg:col-span-2"}>
          <BudgetList refresh={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboard;