import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { getBudgetReportAPI } from "../../services/reports/reportService";

const BudgetReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchReport();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getBudgetReportAPI(filters);
      setReportData(data);
    } catch (err) {
      console.error("Failed to load budget report");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const budgetVsActualData = {
    labels: reportData?.budgetAnalysis?.map(item => item.budgetName) || [],
    datasets: [
      {
        label: "Budget",
        data: reportData?.budgetAnalysis?.map(item => item.budgetAmount) || [],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Actual",
        data: reportData?.budgetAnalysis?.map(item => item.actualSpent) || [],
        backgroundColor: "#FF6384",
      },
    ],
  };

  const utilizationData = {
    labels: ["Under Budget", "Over Budget"],
    datasets: [
      {
        data: [
          reportData?.budgetAnalysis?.filter(item => item.status === "under").length || 0,
          reportData?.budgetAnalysis?.filter(item => item.status === "over").length || 0,
        ],
        backgroundColor: ["#4BC0C0", "#FF6384"],
      },
    ],
  };

  const getStatusColor = (status) => {
    return status === "under" ? "text-green-600" : "text-red-600";
  };

  const getUtilizationColor = (rate) => {
    if (rate <= 80) return "text-green-600";
    if (rate <= 100) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) return <div className="text-center py-4">Loading report...</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Budget Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {reportData && (
        <>
          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Budgeted</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${reportData.summary.totalBudgeted.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">
                  ${reportData.summary.totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Variance</p>
                <p className={`text-2xl font-bold ${reportData.summary.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${reportData.summary.totalVariance.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Utilization</p>
                <p className={`text-2xl font-bold ${getUtilizationColor(reportData.summary.overallUtilization)}`}>
                  {reportData.summary.overallUtilization.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Budget vs Actual</h3>
              <div className="h-64">
                <Bar data={budgetVsActualData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Budget Status</h3>
              <div className="h-64">
                <Doughnut data={utilizationData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Budget Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Budget Name</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-right py-2">Budget</th>
                    <th className="text-right py-2">Spent</th>
                    <th className="text-right py-2">Variance</th>
                    <th className="text-right py-2">Utilization</th>
                    <th className="text-center py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.budgetAnalysis.map((budget, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium">{budget.budgetName}</td>
                      <td className="py-2">{budget.category}</td>
                      <td className="text-right py-2">${budget.budgetAmount.toFixed(2)}</td>
                      <td className="text-right py-2">${budget.actualSpent.toFixed(2)}</td>
                      <td className={`text-right py-2 font-semibold ${budget.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${budget.variance.toFixed(2)}
                      </td>
                      <td className={`text-right py-2 font-semibold ${getUtilizationColor(budget.utilizationRate)}`}>
                        {budget.utilizationRate.toFixed(1)}%
                      </td>
                      <td className="text-center py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          budget.status === "under" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {budget.status === "under" ? "Under" : "Over"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
            <div className="space-y-3">
              {reportData.budgetAnalysis.filter(budget => budget.status === "over").length > 0 && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800">
                  <p className="font-medium">Over Budget Alert</p>
                  <p className="text-sm">
                    {reportData.budgetAnalysis.filter(budget => budget.status === "over").length} budget(s) are over limit. 
                    Consider reducing spending in these categories.
                  </p>
                </div>
              )}
              {reportData.summary.overallUtilization > 90 && (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
                  <p className="font-medium">High Utilization Warning</p>
                  <p className="text-sm">
                    Overall budget utilization is {reportData.summary.overallUtilization.toFixed(1)}%. 
                    Monitor spending closely to avoid exceeding budgets.
                  </p>
                </div>
              )}
              {reportData.summary.overallUtilization < 70 && (
                <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-800">
                  <p className="font-medium">Good Budget Management</p>
                  <p className="text-sm">
                    You're managing your budgets well with {reportData.summary.overallUtilization.toFixed(1)}% utilization. 
                    Consider allocating unused budget to savings or investments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetReport;