import React, { useState, useEffect } from "react";
import { getBudgetAlertsAPI } from "../../services/budget/budgetService";

const BudgetAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await getBudgetAlertsAPI();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (alerts.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-red-600">Budget Alerts</h3>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.budgetId}
            className={`p-3 rounded-lg border-l-4 ${
              alert.type === "exceeded"
                ? "bg-red-50 border-red-500 text-red-800"
                : "bg-yellow-50 border-yellow-500 text-yellow-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{alert.budgetName}</p>
                <p className="text-sm">
                  {alert.category} • ${alert.spent.toFixed(2)} of ${alert.budget.toFixed(2)} used
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{alert.percentage}%</p>
                <p className="text-xs">
                  {alert.type === "exceeded" ? "EXCEEDED" : "WARNING"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetAlerts;