import React, { useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import { getIncomeReportAPI } from "../../services/reports/reportService";
import { listCategoriesAPI } from "../../services/category/categoryService";

const IncomeReport = () => {
  const [reportData, setReportData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    groupBy: "category",
  });

  useEffect(() => {
    fetchCategories();
    fetchReport();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const data = await listCategoriesAPI();
      setCategories(data.filter(cat => cat.type === "income"));
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getIncomeReportAPI(filters);
      setReportData(data);
    } catch (err) {
      console.error("Failed to load income report");
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

  const pieChartData = {
    labels: reportData?.aggregatedData?.map(item => item._id) || [],
    datasets: [
      {
        data: reportData?.aggregatedData?.map(item => item.total) || [],
        backgroundColor: [
          "#4BC0C0", "#36A2EB", "#FFCE56", "#9966FF", "#FF9F40",
          "#FF6384", "#C9CBCF", "#4BC0C0", "#36A2EB", "#FFCE56"
        ],
      },
    ],
  };

  const incomeVsExpenseData = {
    labels: ["Income", "Expenses", "Net Savings"],
    datasets: [
      {
        data: [
          reportData?.summary.totalIncome || 0,
          reportData?.summary.totalExpenses || 0,
          reportData?.summary.netSavings || 0,
        ],
        backgroundColor: ["#4BC0C0", "#FF6384", "#36A2EB"],
      },
    ],
  };

  if (loading) return <div className="text-center py-4">Loading report...</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Income Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group By
            </label>
            <select
              name="groupBy"
              value={filters.groupBy}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="category">Category</option>
              <option value="date">Date</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>
      </div>

      {reportData && (
        <>
          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ${reportData.summary.totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${reportData.summary.totalExpenses.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Net Savings</p>
                <p className={`text-2xl font-bold ${reportData.summary.netSavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ${reportData.summary.netSavings.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Savings Rate</p>
                <p className={`text-2xl font-bold ${reportData.summary.savingsRate >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {reportData.summary.savingsRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Income Sources</h3>
              <div className="h-64">
                <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Income vs Expenses</h3>
              <div className="h-64">
                <Pie data={incomeVsExpenseData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Income Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Income Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{filters.groupBy === "category" ? "Category" : filters.groupBy === "date" ? "Date" : "Month"}</th>
                    <th className="text-right py-2">Total</th>
                    <th className="text-right py-2">Count</th>
                    <th className="text-right py-2">Average</th>
                    <th className="text-right py-2">Max</th>
                    <th className="text-right py-2">Min</th>
                    <th className="text-right py-2">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.aggregatedData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item._id}</td>
                      <td className="text-right py-2 font-semibold">${item.total.toFixed(2)}</td>
                      <td className="text-right py-2">{item.count}</td>
                      <td className="text-right py-2">${item.avgAmount.toFixed(2)}</td>
                      <td className="text-right py-2">${item.maxAmount.toFixed(2)}</td>
                      <td className="text-right py-2">${item.minAmount.toFixed(2)}</td>
                      <td className="text-right py-2">
                        {((item.total / reportData.summary.totalIncome) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Health Indicators */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Financial Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${reportData.summary.savingsRate >= 20 ? 'bg-green-50 border-green-200' : reportData.summary.savingsRate >= 10 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border`}>
                <h4 className="font-medium mb-2">Savings Rate</h4>
                <p className="text-2xl font-bold mb-1">{reportData.summary.savingsRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">
                  {reportData.summary.savingsRate >= 20 ? "Excellent" : reportData.summary.savingsRate >= 10 ? "Good" : "Needs Improvement"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border-blue-200 border">
                <h4 className="font-medium mb-2">Average Income</h4>
                <p className="text-2xl font-bold mb-1">${reportData.summary.averageIncome.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Per transaction</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border-purple-200 border">
                <h4 className="font-medium mb-2">Income Streams</h4>
                <p className="text-2xl font-bold mb-1">{reportData.aggregatedData.length}</p>
                <p className="text-sm text-gray-600">Different sources</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
            <div className="space-y-3">
              {reportData.summary.savingsRate < 10 && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800">
                  <p className="font-medium">Low Savings Rate</p>
                  <p className="text-sm">
                    Your savings rate is {reportData.summary.savingsRate.toFixed(1)}%. 
                    Consider reducing expenses or increasing income to improve financial health.
                  </p>
                </div>
              )}
              {reportData.summary.savingsRate >= 20 && (
                <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-800">
                  <p className="font-medium">Excellent Savings Rate</p>
                  <p className="text-sm">
                    Great job! Your {reportData.summary.savingsRate.toFixed(1)}% savings rate shows strong financial discipline. 
                    Consider investing your surplus for long-term growth.
                  </p>
                </div>
              )}
              {reportData.aggregatedData.length === 1 && (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
                  <p className="font-medium">Single Income Source</p>
                  <p className="text-sm">
                    Consider diversifying your income sources to reduce financial risk and increase earning potential.
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

export default IncomeReport;