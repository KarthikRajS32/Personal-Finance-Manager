import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

// Create Goal
export const createGoalAPI = async (goalData) => {
  const token = getUserFromStorage();
  const response = await axios.post(
    `${BASE_URL}/api/v1/goals/create`,
    goalData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// List Goals
export const listGoalsAPI = async () => {
  const token = getUserFromStorage();
  const response = await axios.get(`${BASE_URL}/api/v1/goals/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update Goal
export const updateGoalAPI = async ({ id, ...updateData }) => {
  const token = getUserFromStorage();
  const response = await axios.put(
    `${BASE_URL}/api/v1/goals/update/${id}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Delete Goal
export const deleteGoalAPI = async (id) => {
  const token = getUserFromStorage();
  const response = await axios.delete(`${BASE_URL}/api/v1/goals/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Add Contribution
export const addContributionAPI = async (id, amount) => {
  const token = getUserFromStorage();
  const response = await axios.put(
    `${BASE_URL}/api/v1/goals/contribute/${id}`,
    { amount },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Get Financial Forecast
export const getFinancialForecastAPI = async (months = 12) => {
  const token = getUserFromStorage();
  const response = await axios.get(
    `${BASE_URL}/api/v1/goals/forecast?months=${months}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};