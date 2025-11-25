import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getFinancialForecastAPI } from "../../services/reports/reportService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FinancialForecast = () => {
  const [months, setMonths] = useState(6);

  const { data: forecast, isLoading: loading, error } = useQuery({
    queryKey: ["financial-forecast", months],
    queryFn: () => getFinancialForecastAPI(months),
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load forecast: {error.message}
      </div>
    );
  }

  if (!forecast) return null;

  const { historical, forecasts, goalAnalysis, recommendations } = forecast;

  // Prepare chart data
  const chartData = {
    labels: forecasts.map(f => f.month),
    datasets: [
      {
        label: "Projected Income",
        data: forecasts.map(f => f.projectedIncome),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.1,
      },
      {
        label: "Projected Expenses",
        data: forecasts.map(f => f.projectedExpense),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.1,
      },
      {
        label: "Projected Savings",
        data: forecasts.map(f => f.projectedSavings),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Financial Forecast",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Historical Trends */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Historical Financial Trends</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Monthly Income</p>
            <p className="text-2xl font-bold text-green-600">
              ${historical.avgMonthlyIncome.toLocaleString()}
            </p>
            <p className={`text-xs mt-1 ${
              historical.incomeTrend >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {historical.incomeTrend >= 0 ? '↗' : '↘'} Trend: ${Math.abs(historical.incomeTrend).toFixed(0)}/month
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Monthly Expense</p>
            <p className="text-2xl font-bold text-red-600">
              ${historical.avgMonthlyExpense.toLocaleString()}
            </p>
            <p className={`text-xs mt-1 ${
              historical.expenseTrend <= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {historical.expenseTrend >= 0 ? '↗' : '↘'} Trend: ${Math.abs(historical.expenseTrend).toFixed(0)}/month
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Monthly Savings</p>
            <p className={`text-2xl font-bold ${
              historical.avgMonthlySavings >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              ${historical.avgMonthlySavings.toLocaleString()}
            </p>
            <p className="text-xs mt-1 text-gray-500">
              Based on 12-month average
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
            <p className={`text-2xl font-bold ${
              (historical.avgMonthlySavings / historical.avgMonthlyIncome * 100) >= 20 ? 'text-green-600' : 
              (historical.avgMonthlySavings / historical.avgMonthlyIncome * 100) >= 10 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {((historical.avgMonthlySavings / historical.avgMonthlyIncome) * 100).toFixed(1)}%
            </p>
            <p className="text-xs mt-1 text-gray-500">
              {((historical.avgMonthlySavings / historical.avgMonthlyIncome) * 100) >= 20 ? 'Excellent' :
               ((historical.avgMonthlySavings / historical.avgMonthlyIncome) * 100) >= 10 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>
        </div>
      </div>

      {/* Forecast Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Financial Forecast</h2>
          <select
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
            <option value={24}>24 Months</option>
            <option value={36}>36 Months</option>
          </select>
        </div>

        {/* Forecast Chart */}
        <div className="mb-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Forecast Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Total Projected Income</h4>
            <p className="text-2xl font-bold text-green-600">
              ${forecasts.reduce((sum, f) => sum + f.projectedIncome, 0).toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-1">
              Over {months} months
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Total Projected Expenses</h4>
            <p className="text-2xl font-bold text-red-600">
              ${forecasts.reduce((sum, f) => sum + f.projectedExpense, 0).toLocaleString()}
            </p>
            <p className="text-sm text-red-600 mt-1">
              Over {months} months
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Net Projected Savings</h4>
            <p className={`text-2xl font-bold ${
              forecasts.reduce((sum, f) => sum + f.projectedSavings, 0) >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              ${forecasts.reduce((sum, f) => sum + f.projectedSavings, 0).toLocaleString()}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Over {months} months
            </p>
          </div>
        </div>

        {/* Detailed Forecast Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4">Month</th>
                <th className="text-right py-3 px-4">Income</th>
                <th className="text-right py-3 px-4">Expense</th>
                <th className="text-right py-3 px-4">Savings</th>
                <th className="text-right py-3 px-4">Savings Rate</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.map((projection, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{projection.month}</td>
                  <td className="text-right py-3 px-4 text-green-600">
                    ${projection.projectedIncome.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 text-red-600">
                    ${projection.projectedExpense.toLocaleString()}
                  </td>
                  <td className={`text-right py-3 px-4 font-medium ${
                    projection.projectedSavings >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    ${projection.projectedSavings.toLocaleString()}
                  </td>
                  <td className={`text-right py-3 px-4 ${
                    projection.savingsRate >= 20 ? 'text-green-600' :
                    projection.savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {projection.savingsRate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goal Analysis */}
      {goalAnalysis && goalAnalysis.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Goal Feasibility Analysis</h2>
          <div className="space-y-4">
            {goalAnalysis.map((goal, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                goal.feasible ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{goal.goalName}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    goal.feasible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {goal.feasible ? 'Achievable' : 'At Risk'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Target Amount</p>
                    <p className="font-medium">${goal.targetAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Remaining</p>
                    <p className="font-medium">${goal.remainingAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Required/Month</p>
                    <p className="font-medium">${goal.requiredMonthlySavings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Projected/Month</p>
                    <p className={`font-medium ${
                      goal.avgProjectedSavings >= goal.requiredMonthlySavings ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${goal.avgProjectedSavings.toLocaleString()}
                    </p>
                  </div>
                </div>
                {!goal.feasible && goal.shortfall > 0 && (
                  <p className="text-red-600 text-sm mt-2">
                    You need an additional ${goal.shortfall.toLocaleString()}/month to meet this goal.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
        <div className="space-y-3">
          {Object.entries(recommendations).map(([key, value], index) => {
            if (!value) return null;
            return (
              <div key={index} className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-500">
                <h4 className="font-medium text-yellow-800 capitalize mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-yellow-700 text-sm">{value}</p>
              </div>
            );
          })}
          {Object.values(recommendations).every(v => !v) && (
            <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
              <p className="text-green-700">Great job! Your financial trends look healthy. Keep up the good work!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialForecast;