import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { getExpenseReportAPI } from "../../services/reports/reportService";
import { listCategoriesAPI } from "../../services/category/categoryService";

const ExpenseReport = () => {
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
      setCategories(data.filter(cat => cat.type === "expense"));
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getExpenseReportAPI(filters);
      setReportData(data);
    } catch (err) {
      console.error("Failed to load expense report");
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
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#FF6384", "#C9CBCF", "#4BC0C0", "#36A2EB"
        ],
      },
    ],
  };

  const barChartData = {
    labels: reportData?.aggregatedData?.map(item => item._id) || [],
    datasets: [
      {
        label: "Amount",
        data: reportData?.aggregatedData?.map(item => item.total) || [],
        backgroundColor: "#FF6384",
      },
    ],
  };

  if (loading) return <div className="text-center py-4">Loading report...</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Expense Report</h2>
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
            <h3 className="text-xl font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${reportData.summary.totalExpenses.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reportData.summary.totalTransactions}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Average Expense</p>
                <p className="text-2xl font-bold text-green-600">
                  ${reportData.summary.averageExpense.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Group By</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {reportData.summary.groupBy}
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Distribution</h3>
              <div className="h-64">
                <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Breakdown</h3>
              <div className="h-64">
                <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Detailed Breakdown</h3>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseReport;