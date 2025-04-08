
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  listTransactionsAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
} from "../../services/transactions/transactionService";
import { listCategoriesAPI } from "../../services/category/categoryService";

const TransactionList = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    category: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    amount: "",
    description: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const { data: categoriesData } = useQuery({
    queryKey: ["list-categories"],
    queryFn: listCategoriesAPI,
  });

  const {
    data: transactions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["list-transactions", filters],
    queryFn: () => listTransactionsAPI(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionAPI,
    onSuccess: () => {
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTransactionAPI,
    onSuccess: () => {
      setEditingId(null);
      refetch();
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditData({
      amount: transaction.amount,
      description: transaction.description,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (id) => {
    updateMutation.mutate({ id, ...editData });
  };

  return (
    <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col text-center gap-2">
          <h2 className="text-lg font-bold">Start Date</h2>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border"
          />
        </div>
        <div className="flex flex-col text-center gap-2">
          <h2 className="text-lg font-bold">End Date</h2>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border"
          />
        </div>

        <div className="relative flex flex-col text-center gap-2">
          <h2 className="text-lg font-bold">Transaction Type</h2>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border w-full"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="relative flex flex-col text-center gap-2">
          <h2 className="text-lg font-bold">Transaction Category</h2>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border w-full"
          >
            <option value="">All Categories</option>
            {categoriesData?.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold mb-4">Filtered Transactions</h3>
        {transactions?.map((t) => (
          <div
            key={t._id}
            className="flex justify-between items-center p-3 bg-white rounded-md shadow mb-2"
          >
            <div>
              <p className="text-sm text-gray-600">
                {new Date(t.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                -{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    t.type === "income"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {t.type}
                </span>
              </p>
              <p className="font-semibold">
                {t.category?.name} - ₹{t.amount}
              </p>
              <p className="text-sm text-gray-500 italic">{t.description}</p>
            </div>

            <div className="flex gap-3">
              {editingId === t._id ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={handleEditChange}
                    className="border p-1 rounded-md w-20"
                  />
                  <input
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    className="border p-1 rounded-md w-40"
                  />
                  <button
                    onClick={() => handleEditSubmit(t._id)}
                    className="text-green-600 font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
