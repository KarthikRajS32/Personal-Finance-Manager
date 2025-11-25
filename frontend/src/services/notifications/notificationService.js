import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

// Get notifications
export const getNotificationsAPI = async (params = {}) => {
  const token = getUserFromStorage();
  const queryParams = new URLSearchParams(params).toString();
  const response = await axios.get(
    `${BASE_URL}/api/v1/notifications?${queryParams}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Mark notification as read
export const markAsReadAPI = async (id) => {
  const token = getUserFromStorage();
  const response = await axios.put(
    `${BASE_URL}/api/v1/notifications/${id}/read`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Mark all notifications as read
export const markAllAsReadAPI = async () => {
  const token = getUserFromStorage();
  const response = await axios.put(
    `${BASE_URL}/api/v1/notifications/read-all`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Delete notification
export const deleteNotificationAPI = async (id) => {
  const token = getUserFromStorage();
  const response = await axios.delete(
    `${BASE_URL}/api/v1/notifications/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};