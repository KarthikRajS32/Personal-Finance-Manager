import React, { useState, useEffect } from "react";
import { listGoalsAPI, deleteGoalAPI, addContributionAPI } from "../../services/goal/goalService";

const GoalList = ({ refresh }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contributionAmount, setContributionAmount] = useState({});

  useEffect(() => {
    fetchGoals();
  }, [refresh]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await listGoalsAPI();
      setGoals(data);
    } catch (err) {
      setError("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteGoalAPI(id);
        fetchGoals();
      } catch (err) {
        setError("Failed to delete goal");
      }
    }
  };

  const handleContribution = async (goalId) => {
    const amount = parseFloat(contributionAmount[goalId]);
    if (!amount || amount <= 0) return;

    try {
      await addContributionAPI(goalId, amount);
      setContributionAmount({ ...contributionAmount, [goalId]: "" });
      fetchGoals();
    } catch (err) {
      setError("Failed to add contribution");
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) return <div className="text-center py-4">Loading goals...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Financial Goals</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {goals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No goals created yet.</p>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{goal.name}</h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(goal.priority)}`}>
                      {goal.priority} priority
                    </span>
                    <span className="text-xs text-gray-500">
                      {goal.category} • Due: {formatDate(goal.deadline)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(goal._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{goal.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getProgressColor(goal.progress)}`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600">Target</p>
                  <p className="font-semibold">${goal.targetAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Current</p>
                  <p className="font-semibold">${goal.currentAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Remaining</p>
                  <p className="font-semibold">${(goal.targetAmount - goal.currentAmount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Days Left</p>
                  <p className="font-semibold">{goal.daysLeft}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Monthly Contribution</p>
                    <p className="font-semibold">${goal.monthlyContribution.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Required Monthly</p>
                    <p className={`font-semibold ${goal.isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
                      ${goal.requiredMonthly.toFixed(2)}
                    </p>
                  </div>
                </div>
                {!goal.isOnTrack && (
                  <p className="text-red-600 text-xs mt-2">
                    ⚠️ Increase monthly contribution to stay on track
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Add contribution"
                  value={contributionAmount[goal._id] || ""}
                  onChange={(e) => setContributionAmount({
                    ...contributionAmount,
                    [goal._id]: e.target.value
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
                <button
                  onClick={() => handleContribution(goal._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalList;