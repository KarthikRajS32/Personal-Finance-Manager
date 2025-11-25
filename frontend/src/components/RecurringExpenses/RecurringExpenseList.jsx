import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaTrash, FaPlay, FaPause } from "react-icons/fa";
import {
  getRecurringExpensesAPI,
  deleteRecurringExpenseAPI,
  updateRecurringExpenseAPI,
  processDueRecurringExpensesAPI,
} from "../../services/recurringExpenses/recurringExpenseService";

const RecurringExpenseList = () => {
  const { data: recurringExpenses, isLoading, refetch } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: getRecurringExpensesAPI,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecurringExpenseAPI,
    onSuccess: () => refetch(),
  });

  const toggleMutation = useMutation({
    mutationFn: updateRecurringExpenseAPI,
    onSuccess: () => refetch(),
  });

  const processMutation = useMutation({
    mutationFn: processDueRecurringExpensesAPI,
    onSuccess: () => refetch(),
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this recurring expense?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (expense) => {
    toggleMutation.mutate({
      id: expense._id,
      isActive: !expense.isActive,
    });
  };

  const handleProcessDue = () => {
    processMutation.mutate();
  };

  if (isLoading) return <div className="text-center">Loading...</div>;

  return (
    <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Recurring Expenses</h3>
        <button
          onClick={handleProcessDue}
          disabled={processMutation.isPending}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {processMutation.isPending ? "Processing..." : "Process Due"}
        </button>
      </div>

      <div className="space-y-4">
        {recurringExpenses?.map((expense) => (
          <div
            key={expense._id}
            className={`p-4 rounded-lg border-l-4 ${
              expense.isActive ? "border-green-500 bg-green-50" : "border-gray-400 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{expense.name}</h4>
                <p className="text-gray-600">₹{expense.amount} - {expense.frequency}</p>
                <p className="text-sm text-gray-500">Category: {expense.category}</p>
                <p className="text-sm text-gray-500">
                  Next Due: {new Date(expense.nextDueDate).toLocaleDateString()}
                </p>
                {expense.description && (
                  <p className="text-sm text-gray-500 italic">{expense.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      expense.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {expense.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(expense)}
                  className={`p-2 rounded ${
                    expense.isActive
                      ? "text-yellow-600 hover:bg-yellow-100"
                      : "text-green-600 hover:bg-green-100"
                  }`}
                  title={expense.isActive ? "Pause" : "Activate"}
                >
                  {expense.isActive ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}

        {recurringExpenses?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recurring expenses found. Add one to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default RecurringExpenseList;