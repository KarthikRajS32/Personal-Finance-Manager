import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
//! Login
export const loginAPI = async ({ email, password }) => {
  const response = await axios.post(`${BASE_URL}/api/v1/users/login`, {
    email,
    password,
  });
  //Return a promise
  return response.data;
};
//! register
export const registerAPI = async ({ email, password, username }) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/users/register`,
    {
      email,
      password,
      username,
    },
    {
      headers: {
        "Content-Type": "application/json", // ✅ REQUIRED for Express to parse body
      },
    }
  );

  return response.data;
};
//! change password
export const changePasswordAPI = async (newPassword) => {
  const token = getUserFromStorage();
  const response = await axios.put(
    `${BASE_URL}/api/v1/users/change-password`,
    {
      newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  //Return a promise
  return response.data;
};

//! update Profile
export const updateProfileAPI = async (profileData) => {
  const token = getUserFromStorage();
  const response = await axios.put(
    `${BASE_URL}/api/v1/users/update-profile`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//! Get user settings
export const getUserSettingsAPI = async () => {
  const token = getUserFromStorage();
  const response = await axios.get(
    `${BASE_URL}/api/v1/users/settings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//! Setup MFA
export const setupMFAAPI = async () => {
  const token = getUserFromStorage();
  const response = await axios.post(
    `${BASE_URL}/api/v1/users/setup-mfa`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//! Verify MFA
export const verifyMFAAPI = async ({ token: mfaToken }) => {
  const token = getUserFromStorage();
  const response = await axios.post(
    `${BASE_URL}/api/v1/users/verify-mfa`,
    { token: mfaToken },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//! Disable MFA
export const disableMFAAPI = async ({ token: mfaToken }) => {
  const token = getUserFromStorage();
  const response = await axios.post(
    `${BASE_URL}/api/v1/users/disable-mfa`,
    { token: mfaToken },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
