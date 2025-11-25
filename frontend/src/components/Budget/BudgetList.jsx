import React, { useState, useEffect } from "react";
import { listBudgetsAPI, deleteBudgetAPI } from "../../services/budget/budgetService";

const BudgetList = ({ refresh }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, [refresh]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await listBudgetsAPI();
      setBudgets(data);
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await deleteBudgetAPI(id);
        fetchBudgets();
      } catch (err) {
        setError("Failed to delete budget");
      }
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  if (loading) return <div className="text-center py-4">Loading budgets...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Budgets</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {budgets.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No budgets created yet.</p>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = Math.round((budget.spent / budget.amount) * 100);
            const remaining = budget.amount - budget.spent;

            return (
              <div key={budget._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{budget.name}</h3>
                    <p className="text-sm text-gray-600">
                      {budget.category} • {budget.period}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className={getStatusColor(percentage)}>
                      {percentage}% used
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Budget</p>
                    <p className="font-semibold">${budget.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Spent</p>
                    <p className="font-semibold">${budget.spent.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Remaining</p>
                    <p className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${remaining.toFixed(2)}
                    </p>
                  </div>
                </div>

                {percentage >= budget.alertThreshold && (
                  <div className={`mt-3 p-2 rounded text-sm ${
                    percentage >= 100 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {percentage >= 100 
                      ? '⚠️ Budget exceeded!' 
                      : '⚠️ Approaching budget limit'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetList;