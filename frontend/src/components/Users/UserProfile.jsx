import React, { useState, useEffect } from "react";
import { FaUserCircle, FaEnvelope, FaLock, FaBell, FaCog, FaQrcode } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import UpdatePassword from "./UpdatePassword";
import { updateProfileAPI, getUserSettingsAPI, setupMFAAPI, verifyMFAAPI, disableMFAAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";
import * as Yup from "yup";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [mfaToken, setMfaToken] = useState("");

  // Fetch user settings
  const { data: userSettings, isLoading: settingsLoading, refetch } = useQuery({
    queryKey: ["user-settings"],
    queryFn: getUserSettingsAPI,
  });

  // Update profile mutation
  const { mutateAsync: updateProfile, isPending: updatePending, isError: updateError, error: updateErrorMsg, isSuccess: updateSuccess } = useMutation({
    mutationFn: updateProfileAPI,
    mutationKey: ["update-profile"],
    onSuccess: () => refetch(),
  });

  // MFA mutations
  const { mutateAsync: setupMFA } = useMutation({
    mutationFn: setupMFAAPI,
  });

  const { mutateAsync: verifyMFA } = useMutation({
    mutationFn: verifyMFAAPI,
    onSuccess: () => {
      setShowMFASetup(false);
      refetch();
    },
  });

  const { mutateAsync: disableMFA } = useMutation({
    mutationFn: disableMFAAPI,
    onSuccess: () => refetch(),
  });

  const profileSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    profile: Yup.object({
      firstName: Yup.string(),
      lastName: Yup.string(),
      phone: Yup.string(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      profile: {
        firstName: "",
        lastName: "",
        phone: "",
        dateOfBirth: "",
      },
      preferences: {
        currency: "USD",
        dateFormat: "MM/DD/YYYY",
        timezone: "UTC",
        language: "en",
      },
      notifications: {
        email: true,
        push: true,
        budgetAlerts: true,
        goalReminders: true,
        recurringExpenses: true,
      },
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      updateProfile(values);
    },
  });

  useEffect(() => {
    if (userSettings) {
      formik.setValues({
        username: userSettings.username || "",
        email: userSettings.email || "",
        profile: {
          firstName: userSettings.profile?.firstName || "",
          lastName: userSettings.profile?.lastName || "",
          phone: userSettings.profile?.phone || "",
          dateOfBirth: userSettings.profile?.dateOfBirth ? userSettings.profile.dateOfBirth.split('T')[0] : "",
        },
        preferences: {
          currency: userSettings.preferences?.currency || "USD",
          dateFormat: userSettings.preferences?.dateFormat || "MM/DD/YYYY",
          timezone: userSettings.preferences?.timezone || "UTC",
          language: userSettings.preferences?.language || "en",
        },
        notifications: {
          email: userSettings.notifications?.email ?? true,
          push: userSettings.notifications?.push ?? true,
          budgetAlerts: userSettings.notifications?.budgetAlerts ?? true,
          goalReminders: userSettings.notifications?.goalReminders ?? true,
          recurringExpenses: userSettings.notifications?.recurringExpenses ?? true,
        },
      });
    }
  }, [userSettings]);

  const handleMFASetup = async () => {
    try {
      const response = await setupMFA();
      setQrCode(response.qrCode);
      setShowMFASetup(true);
    } catch (error) {
      console.error("MFA setup error:", error);
    }
  };

  const handleMFAVerify = async () => {
    try {
      await verifyMFA({ token: mfaToken });
      setMfaToken("");
    } catch (error) {
      console.error("MFA verification error:", error);
    }
  };

  const handleMFADisable = async () => {
    try {
      await disableMFA({ token: mfaToken });
      setMfaToken("");
    } catch (error) {
      console.error("MFA disable error:", error);
    }
  };

  if (settingsLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  return (
    <div className="max-w-6xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-3xl text-center font-extrabold text-gray-800">
        User Profile & Settings
      </h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: "profile", label: "Profile", icon: FaUserCircle },
          { id: "preferences", label: "Preferences", icon: FaCog },
          { id: "notifications", label: "Notifications", icon: FaBell },
          { id: "security", label: "Security", icon: MdSecurity },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-4 py-2 mr-4 rounded-t-lg transition-colors ${
              activeTab === id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon className="mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Display messages */}
      {updatePending && <AlertMessage type="loading" message="Updating..." />}
      {updateError && (
        <AlertMessage type="error" message={updateErrorMsg?.response?.data?.message || "Update failed"} />
      )}
      {updateSuccess && (
        <AlertMessage type="success" message="Profile updated successfully" />
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  {...formik.getFieldProps("username")}
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your username"
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  {...formik.getFieldProps("email")}
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your email"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  {...formik.getFieldProps("profile.firstName")}
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  {...formik.getFieldProps("profile.lastName")}
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  {...formik.getFieldProps("profile.phone")}
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  {...formik.getFieldProps("profile.dateOfBirth")}
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Application Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  {...formik.getFieldProps("preferences.currency")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  {...formik.getFieldProps("preferences.dateFormat")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  {...formik.getFieldProps("preferences.timezone")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  {...formik.getFieldProps("preferences.language")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              {[
                { key: "email", label: "Email Notifications", description: "Receive notifications via email" },
                { key: "push", label: "Push Notifications", description: "Receive browser push notifications" },
                { key: "budgetAlerts", label: "Budget Alerts", description: "Get notified when approaching budget limits" },
                { key: "goalReminders", label: "Goal Reminders", description: "Receive reminders about your financial goals" },
                { key: "recurringExpenses", label: "Recurring Expense Alerts", description: "Get notified about upcoming recurring expenses" },
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{label}</h4>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...formik.getFieldProps(`notifications.${key}`)}
                      checked={formik.values.notifications[key]}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-4">Two-Factor Authentication (MFA)</h4>
              
              {userSettings?.security?.mfaEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-center text-green-600">
                    <MdSecurity className="mr-2" />
                    <span>MFA is enabled and protecting your account</span>
                  </div>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={mfaToken}
                      onChange={(e) => setMfaToken(e.target.value)}
                      placeholder="Enter MFA code to disable"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={handleMFADisable}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Disable MFA
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">Enhance your account security with two-factor authentication</p>
                  <button
                    type="button"
                    onClick={handleMFASetup}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <FaQrcode className="mr-2" />
                    Setup MFA
                  </button>
                </div>
              )}
            </div>

            <UpdatePassword />
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={updatePending}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            {updatePending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* MFA Setup Modal */}
      {showMFASetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Setup Two-Factor Authentication</h3>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app:
              </p>
              {qrCode && <img src={qrCode} alt="MFA QR Code" className="mx-auto mb-4" />}
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={mfaToken}
                onChange={(e) => setMfaToken(e.target.value)}
                placeholder="Enter verification code"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowMFASetup(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMFAVerify}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Verify & Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
