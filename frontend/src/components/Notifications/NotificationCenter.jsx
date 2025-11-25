import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaBell, FaCheck, FaTrash, FaFilter, FaExclamationTriangle, FaBullseye, FaRedo, FaCalendar, FaTrophy } from "react-icons/fa";
import { getNotificationsAPI, markAsReadAPI, markAllAsReadAPI, deleteNotificationAPI } from "../../services/notifications/notificationService";

const NotificationCenter = () => {
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationData, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications", filter, typeFilter],
    queryFn: () => {
      const params = {};
      if (filter === "unread") params.unreadOnly = true;
      if (typeFilter !== "all") params.type = typeFilter;
      return getNotificationsAPI(params);
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markAsReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotificationAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const notifications = notificationData?.notifications || [];
  const unreadCount = notificationData?.unreadCount || 0;

  const getNotificationIcon = (type) => {
    const iconClass = "text-xl";
    switch (type) {
      case "budget_alert": return <FaExclamationTriangle className={`${iconClass} text-red-500`} />;
      case "goal_reminder": return <FaBullseye className={`${iconClass} text-blue-500`} />;
      case "recurring_expense": return <FaRedo className={`${iconClass} text-purple-500`} />;
      case "bill_due": return <FaCalendar className={`${iconClass} text-orange-500`} />;
      case "achievement": return <FaTrophy className={`${iconClass} text-yellow-500`} />;
      default: return <FaBell className={`${iconClass} text-gray-500`} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeDisplayName = (type) => {
    switch (type) {
      case "budget_alert": return "Budget Alert";
      case "goal_reminder": return "Goal Reminder";
      case "recurring_expense": return "Recurring Expense";
      case "bill_due": return "Bill Due";
      case "achievement": return "Achievement";
      default: return "Notification";
    }
  };

  const notificationTypes = [
    { value: "all", label: "All Types" },
    { value: "budget_alert", label: "Budget Alerts" },
    { value: "goal_reminder", label: "Goal Reminders" },
    { value: "recurring_expense", label: "Recurring Expenses" },
    { value: "bill_due", label: "Bills Due" },
    { value: "achievement", label: "Achievements" },
  ];

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      Failed to load notifications: {error.message}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <FaBell className="text-2xl text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-800">Notification Center</h2>
              {unreadCount > 0 && (
                <span className="ml-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => refetch()}
                className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
              >
                <FaRedo className="mr-2" />
                Refresh
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm transition-colors"
                >
                  <FaCheck className="mr-2" />
                  Mark All Read ({unreadCount})
                </button>
              )}
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Read Status Filter */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "all" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "unread" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>
            
            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {notificationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No notifications found</h3>
              <p className="text-gray-400">
                {filter === "unread" ? "You're all caught up!" : "No notifications to display."}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 transition-colors ${
                  !notification.read 
                    ? "bg-blue-50 border-l-4 border-blue-500" 
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`text-lg font-medium text-gray-900 ${
                          !notification.read ? "font-semibold" : ""
                        }`}>
                          {notification.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          getPriorityColor(notification.priority)
                        }`}>
                          {notification.priority.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {getTypeDisplayName(notification.type)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>
                          {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                        </span>
                        {!notification.read && (
                          <span className="flex items-center text-blue-600">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsReadMutation.mutate(notification._id)}
                        disabled={markAsReadMutation.isPending}
                        className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md text-sm transition-colors"
                        title="Mark as read"
                      >
                        <FaCheck className="mr-1" />
                        Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotificationMutation.mutate(notification._id)}
                      disabled={deleteNotificationMutation.isPending}
                      className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md text-sm transition-colors"
                      title="Delete notification"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;