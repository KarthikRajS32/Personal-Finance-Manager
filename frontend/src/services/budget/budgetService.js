import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

// Create Budget
export const createBudgetAPI = async ({ name, category, amount, period, alertThreshold }) => {
  const token = getUserFromStorage();
  const response = await axios.post(
    `${BASE_URL}/api/v1/budgets/create`,
    { name, category, amount, period, alertThreshold },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// List Budgets
export const listBudgetsAPI = async () => {
  const token = getUserFromStorage();
  const response = await axios.get(`${BASE_URL}/api/v1/budgets/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update Budget
export const updateBudgetAPI = async ({ id, ...updateData }) => {
  const token = getUserFromStorage();
  const response = await axios.put(
    `${BASE_URL}/api/v1/budgets/update/${id}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Delete Budget
export const deleteBudgetAPI = async (id) => {
  const token = getUserFromStorage();
  const response = await axios.delete(`${BASE_URL}/api/v1/budgets/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get Budget Alerts
export const getBudgetAlertsAPI = async () => {
  const token = getUserFromStorage();
  const response = await axios.get(`${BASE_URL}/api/v1/budgets/alerts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};