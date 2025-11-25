import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { getAnalyticsAPI } from "../../services/transactions/transactionService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ExpenseAnalytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", dateRange],
    queryFn: () => getAnalyticsAPI(dateRange),
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  // Prepare pie chart data for category distribution
  const pieChartData = {
    labels: analyticsData?.categoryData?.map(item => item._id) || [],
    datasets: [
      {
        label: "Expense Distribution",
        data: analyticsData?.categoryData?.map(item => item.total) || [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare bar chart data for monthly trends
  const monthlyLabels = [];
  const incomeData = [];
  const expenseData = [];

  analyticsData?.monthlyData?.forEach(item => {
    const monthLabel = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
    if (!monthlyLabels.includes(monthLabel)) {
      monthlyLabels.push(monthLabel);
    }
    
    const index = monthlyLabels.indexOf(monthLabel);
    if (item._id.type === "income") {
      incomeData[index] = item.total;
    } else {
      expenseData[index] = item.total;
    }
  });

  const barChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "#4BC0C0",
        borderColor: "#4BC0C0",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: "#FF6384",
        borderColor: "#FF6384",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  if (isLoading) return <div className="text-center">Loading analytics...</div>;

  return (
    <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
      <h3 className="text-xl font-semibold mb-6">Expense Analytics</h3>
      
      {/* Date Range Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Pie Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-4 text-center">
            Expense Distribution by Category
          </h4>
          {analyticsData?.categoryData?.length > 0 ? (
            <div className="h-64">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
        </div>

        {/* Monthly Trends Bar Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-4 text-center">
            Monthly Income vs Expenses
          </h4>
          {analyticsData?.monthlyData?.length > 0 ? (
            <div className="h-64">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No monthly data available
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {analyticsData?.categoryData?.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h5 className="font-medium text-blue-800">Total Categories</h5>
            <p className="text-2xl font-bold text-blue-600">
              {analyticsData.categoryData.length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <h5 className="font-medium text-red-800">Total Expenses</h5>
            <p className="text-2xl font-bold text-red-600">
              ₹{analyticsData.categoryData.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h5 className="font-medium text-green-800">Highest Category</h5>
            <p className="text-lg font-bold text-green-600">
              {analyticsData.categoryData[0]?._id}
            </p>
            <p className="text-sm text-green-500">
              ₹{analyticsData.categoryData[0]?.total.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseAnalytics;