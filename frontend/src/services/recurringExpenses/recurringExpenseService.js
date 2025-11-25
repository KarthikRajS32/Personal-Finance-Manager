import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
import axios from "axios";

const token = getUserFromStorage();

// Create recurring expense
export const createRecurringExpenseAPI = async (recurringExpenseData) => {
  const response = await axios.post(
    `${BASE_URL}/recurring-expenses`,
    recurringExpenseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get all recurring expenses
export const getRecurringExpensesAPI = async () => {
  const response = await axios.get(`${BASE_URL}/recurring-expenses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update recurring expense
export const updateRecurringExpenseAPI = async ({ id, ...data }) => {
  const response = await axios.put(
    `${BASE_URL}/recurring-expenses/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Delete recurring expense
export const deleteRecurringExpenseAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/recurring-expenses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Process due recurring expenses
export const processDueRecurringExpensesAPI = async () => {
  const response = await axios.post(
    `${BASE_URL}/recurring-expenses/process-due`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};