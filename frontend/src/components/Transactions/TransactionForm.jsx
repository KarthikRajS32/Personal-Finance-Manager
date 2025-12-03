import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FaDollarSign,
  FaCalendarAlt,
  FaRegCommentDots,
  FaWallet,
  FaRedoAlt,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { listCategoriesAPI } from "../../services/category/categoryService";
import { addTransactionAPI } from "../../services/transactions/transactionService";
import { createRecurringExpenseAPI } from "../../services/recurringExpenses/recurringExpenseService";
import AlertMessage from "../Alert/AlertMessage";

const getValidationSchema = (isRecurring) => {
  const baseSchema = {
    amount: Yup.number().required("Amount is required").positive("Amount must be positive"),
    category: Yup.string().required("Category is required"),
    description: Yup.string(),
  };

  if (isRecurring) {
    return Yup.object({
      ...baseSchema,
      name: Yup.string().required("Name is required"),
      frequency: Yup.string().required("Frequency is required"),
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date().min(Yup.ref("startDate"), "End date must be after start date"),
    });
  } else {
    return Yup.object({
      ...baseSchema,
      type: Yup.string().required("Transaction type is required").oneOf(["income", "expense"]),
      date: Yup.date().required("Date is required"),
    });
  }
};



const TransactionForm = () => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const transactionMutation = useMutation({
    mutationFn: addTransactionAPI,
    mutationKey: ["add-transaction"],
  });

  const recurringMutation = useMutation({
    mutationFn: createRecurringExpenseAPI,
    mutationKey: ["add-recurring-expense"],
  });

  const { data: categories, isError, error } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  const currentMutation = isRecurring ? recurringMutation : transactionMutation;

  const getInitialValues = () => {
    if (isRecurring) {
      return {
        name: "",
        amount: "",
        category: "",
        frequency: "",
        startDate: "",
        endDate: "",
        description: "",
      };
    } else {
      return {
        type: "",
        amount: "",
        category: "",
        date: "",
        description: "",
      };
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: getValidationSchema(isRecurring),
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await currentMutation.mutateAsync(values);
        resetForm();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (e) {
        console.error(e);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isRecurring ? "Add Recurring Expense" : "Add Transaction"}
            </h1>
            <p className="text-blue-100">
              {isRecurring ? "Set up automatic recurring payments" : "Record your income or expense"}
            </p>
          </div>
          
          <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">


            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className={`font-semibold ${!isRecurring ? 'text-blue-600' : 'text-gray-500'}`}>One-time Transaction</span>
              <button
                type="button"
                onClick={() => setIsRecurring(!isRecurring)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isRecurring ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isRecurring ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className={`font-semibold ${isRecurring ? 'text-blue-600' : 'text-gray-500'}`}>Recurring Expense</span>
            </div>

      {isError && (
        <AlertMessage
          type="error"
          message={error?.response?.data?.message || "Something went wrong"}
        />
      )}
      {showSuccess && (
        <AlertMessage
          type="success"
          message={`${isRecurring ? 'Recurring expense' : 'Transaction'} added successfully`}
        />
      )}
            {/* Name Field (Recurring only) */}
            {isRecurring && (
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-700">
                  <FaRegCommentDots className="mr-2 text-blue-500" />
                  Name
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("name")}
                  id="name"
                  placeholder="e.g., Netflix Subscription"
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm">{formik.errors.name}</p>
                )}
              </div>
            )}

            {/* Transaction Type Field (One-time only) */}
            {!isRecurring && (
              <div className="space-y-2">
                <label htmlFor="type" className="flex items-center text-sm font-semibold text-gray-700">
                  <FaWallet className="mr-2 text-blue-500" />
                  Type
                </label>
                <select
                  {...formik.getFieldProps("type")}
                  id="type"
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select transaction type</option>
                  <option value="income">💰 Income</option>
                  <option value="expense">💸 Expense</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                  <p className="text-red-500 text-sm">{formik.errors.type}</p>
                )}
              </div>
            )}

            {/* Amount Field */}
            <div className="space-y-2">
              <label htmlFor="amount" className="flex items-center text-sm font-semibold text-gray-700">
                <FaDollarSign className="mr-2 text-green-500" />
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...formik.getFieldProps("amount")}
                  id="amount"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              {formik.touched.amount && formik.errors.amount && (
                <p className="text-red-500 text-sm">{formik.errors.amount}</p>
              )}
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label htmlFor="category" className="flex items-center text-sm font-semibold text-gray-700">
                <FaRegCommentDots className="mr-2 text-blue-500" />
                Category
              </label>
              <select
                {...formik.getFieldProps("category")}
                id="category"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a category</option>
                {categories?.filter(cat => isRecurring ? cat.type === "expense" : true).map((category) => (
                  <option key={category?._id} value={category?.name}>
                    {category?.name}
                  </option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category && (
                <p className="text-red-500 text-sm">{formik.errors.category}</p>
              )}
            </div>

      {/* Frequency Field (Recurring only) */}
      {isRecurring && (
        <div className="flex flex-col space-y-1">
          <label htmlFor="frequency" className="text-gray-700 font-medium">
            <FaRedoAlt className="inline mr-2 text-blue-500" />
            Frequency
          </label>
          <select
            {...formik.getFieldProps("frequency")}
            id="frequency"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {formik.touched.frequency && formik.errors.frequency && (
            <p className="text-red-500 text-xs italic">{formik.errors.frequency}</p>
          )}
        </div>
      )}

      {/* Date Fields */}
      {isRecurring ? (
        <>
          <div className="flex flex-col space-y-1">
            <label htmlFor="startDate" className="text-gray-700 font-medium">
              <FaCalendarAlt className="inline mr-2 text-blue-500" />
              Start Date
            </label>
            <input
              type="date"
              {...formik.getFieldProps("startDate")}
              id="startDate"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <p className="text-red-500 text-xs italic">{formik.errors.startDate}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="endDate" className="text-gray-700 font-medium">
              End Date (Optional)
            </label>
            <input
              type="date"
              {...formik.getFieldProps("endDate")}
              id="endDate"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <p className="text-red-500 text-xs italic">{formik.errors.endDate}</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col space-y-1">
          <label htmlFor="date" className="text-gray-700 font-medium">
            <FaCalendarAlt className="inline mr-2 text-blue-500" />
            Date
          </label>
          <input
            type="date"
            {...formik.getFieldProps("date")}
            id="date"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {formik.touched.date && formik.errors.date && (
            <p className="text-red-500 text-xs italic">{formik.errors.date}</p>
          )}
        </div>
      )}

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-700">
                <FaRegCommentDots className="mr-2 text-blue-500" />
                Description (Optional)
              </label>
              <textarea
                {...formik.getFieldProps("description")}
                id="description"
                placeholder="Add any additional notes..."
                rows="3"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">{formik.errors.description}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={currentMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {currentMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  `Add ${isRecurring ? 'Recurring Expense' : 'Transaction'}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
