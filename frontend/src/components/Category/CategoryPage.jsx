import React from "react";
import { useQuery } from "@tanstack/react-query";
import AddCategory from "./AddCategory";
import CategoriesList from "./CategoriesList";
import { listCategoriesAPI } from "../../services/category/categoryService";

const CategoryPage = () => {
  const { refetch } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  const handleCategoryAdded = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Manage Categories
          </h1>
          <p className="text-gray-600 text-lg">
            Create and organize your income and expense categories
          </p>
        </div>

        <AddCategory onCategoryAdded={handleCategoryAdded} />
        <CategoriesList />
      </div>
    </div>
  );
};

export default CategoryPage;