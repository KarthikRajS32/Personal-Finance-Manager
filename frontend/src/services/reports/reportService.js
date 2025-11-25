import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

// Get Expense Report
export const getExpenseReportAPI = async (filters = {}) => {
  const token = getUserFromStorage();
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/reports/expense?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Get Budget Report
export const getBudgetReportAPI = async (filters = {}) => {
  const token = getUserFromStorage();
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/reports/budget?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Get Income Report
export const getIncomeReportAPI = async (filters = {}) => {
  const token = getUserFromStorage();
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/reports/income?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Get Comprehensive Report
export const getComprehensiveReportAPI = async (filters = {}) => {
  const token = getUserFromStorage();
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/reports/comprehensive?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Get Financial Forecast
export const getFinancialForecastAPI = async (months = 6) => {
  const token = getUserFromStorage();
  const response = await axios.get(
    `${BASE_URL}/api/v1/reports/forecast?months=${months}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};