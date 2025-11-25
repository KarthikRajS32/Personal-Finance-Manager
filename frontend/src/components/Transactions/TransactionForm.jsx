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
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {isRecurring ? "Add Recurring Expense" : "Add Transaction"}
        </h2>
        <p className="text-gray-600">
          {isRecurring ? "Set up automatic recurring payments" : "Fill in the transaction details"}
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-lg">
        <span className={`font-medium ${!isRecurring ? 'text-blue-600' : 'text-gray-500'}`}>One-time</span>
        <button
          type="button"
          onClick={() => setIsRecurring(!isRecurring)}
          className="text-2xl text-blue-500 hover:text-blue-600"
        >
          {isRecurring ? <FaToggleOn /> : <FaToggleOff />}
        </button>
        <span className={`font-medium ${isRecurring ? 'text-blue-600' : 'text-gray-500'}`}>Recurring</span>
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
          <label htmlFor="name" className="flex gap-2 items-center text-gray-700 font-medium">
            <FaRegCommentDots className="text-blue-500" />
            <span>Name</span>
          </label>
          <input
            type="text"
            {...formik.getFieldProps("name")}
            id="name"
            placeholder="e.g., Netflix Subscription"
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-xs">{formik.errors.name}</p>
          )}
        </div>
      )}

      {/* Transaction Type Field (One-time only) */}
      {!isRecurring && (
        <div className="space-y-2">
          <label htmlFor="type" className="flex gap-2 items-center text-gray-700 font-medium">
            <FaWallet className="text-blue-500" />
            <span>Type</span>
          </label>
          <select
            {...formik.getFieldProps("type")}
            id="type"
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select transaction type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <p className="text-red-500 text-xs">{formik.errors.type}</p>
          )}
        </div>
      )}

      {/* Amount Field */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="amount" className="text-gray-700 font-medium">
          <FaDollarSign className="inline mr-2 text-blue-500" />
          Amount
        </label>
        <input
          type="number"
          {...formik.getFieldProps("amount")}
          id="amount"
          placeholder="Amount"
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-red-500 text-xs italic">{formik.errors.amount}</p>
        )}
      </div>

      {/* Category Field */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="category" className="text-gray-700 font-medium">
          <FaRegCommentDots className="inline mr-2 text-blue-500" />
          Category
        </label>
        <select
          {...formik.getFieldProps("category")}
          id="category"
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="">Select a category</option>
          {categories?.filter(cat => isRecurring ? cat.type === "expense" : true).map((category) => (
            <option key={category?._id} value={category?.name}>
              {category?.name}
            </option>
          ))}
        </select>
        {formik.touched.category && formik.errors.category && (
          <p className="text-red-500 text-xs italic">
            {formik.errors.category}
          </p>
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
      <div className="flex flex-col space-y-1">
        <label htmlFor="description" className="text-gray-700 font-medium">
          <FaRegCommentDots className="inline mr-2 text-blue-500" />
          Description (Optional)
        </label>
        <textarea
          {...formik.getFieldProps("description")}
          id="description"
          placeholder="Description"
          rows="3"
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        ></textarea>
        {formik.touched.description && formik.errors.description && (
          <p className="text-red-500 text-xs italic">
            {formik.errors.description}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={currentMutation.isPending}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50"
      >
        {currentMutation.isPending
          ? "Adding..."
          : `Add ${isRecurring ? 'Recurring Expense' : 'Transaction'}`}
      </button>
    </form>
  );
};

export default TransactionForm;
