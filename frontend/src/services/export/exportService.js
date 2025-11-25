import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

// Export transactions
export const exportTransactionsAPI = async (filters = {}) => {
  const token = getUserFromStorage();
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/export/transactions?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Export budgets
export const exportBudgetsAPI = async () => {
  const token = getUserFromStorage();
  const response = await axios.get(
    `${BASE_URL}/api/v1/export/budgets`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Export goals
export const exportGoalsAPI = async () => {
  const token = getUserFromStorage();
  const response = await axios.get(
    `${BASE_URL}/api/v1/export/goals`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Export financial report
export const exportFinancialReportAPI = async (filters = {}) => {
  const token = getUserFromStorage();
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/export/financial-report?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Utility functions for client-side export
export const downloadCSV = (data, filename) => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadJSON = (data, filename) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};