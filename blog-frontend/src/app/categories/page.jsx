"use client";
import React, { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { useAuth } from "@/components/AuthProvider";
import Modal from "@/components/Modal";

export default function categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getCategories();
        setCategories(response);
      } catch (error) {
        console.log("Error fetching categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleEditClick = (category) => {
    setEditingCategoryId(category.id);
    setEditForm({
      name: category.name || "",
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleCancelClick = () => {
    setEditingCategoryId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseCategoryUpdated = await apiService.updateCategory(
        editingCategoryId,
        {
          id: editingCategoryId,
          name: editForm.name,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      // Create a new array with all the categories except the one being edited, if id matches, update the category
      setCategories(
        categories.map((category) =>
          category.id === editingCategoryId ? responseCategoryUpdated : category
        )
      );
      // Exit edit mode
      setEditingCategoryId(null);
    } catch (error) {
      console.log("Error editing category", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await apiService.deleteCategory(categoryId);
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      // Remove deleted categories from list
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNewCategory = async () => {
    try {
      const responseNewCategory = await apiService.createCategory({
        name: categoryName,
      });
      if (!responseNewCategory.ok) {
        throw new Error("Failed to create category");
      }
      // Add the new category to the list
      setCategories((prevCategories) => [
        ...prevCategories,
        responseNewCategory,
      ]);

      setCategoryName(""); // Clear input
      setIsOpen(false); // Close modal
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) return <div className="pt-20 text-center">Loading...</div>;
  return (
    <div>
      <div className="pt-10 max-w-4xl mx-auto px-4">
        <div className="p-6 rounded border shadow bg-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold mb-4">Categories</h1>
            <button
              onClick={() => setIsOpen(true)}
              className="border bg-blue-400 p-2 rounded-xl mb-4 text-white cursor-pointer"
            >
              + New Category
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <h2 className="text-lg font-bold mb-4">Add Category</h2>
              <input
                minLength={2}
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="w-full p-2 mb-4 rounded bg-gray-100"
              />
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewCategory}
                  className="px-4 py-2 bg-blue-400 text-white rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            </Modal>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Post Count</th>
                <th className="px-6 py-3 text-left font-medium ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  {editingCategoryId === cat.id ? (
                    //edit
                    <>
                      <td className="px-6 py-3 text-left ">
                        <input
                          type="text"
                          name="name"
                          required
                          value={editForm.name}
                          onChange={handleEditFormChange}
                          className="text-sm px-2 py-1 border rounded"
                        ></input>
                      </td>
                      <td className="px-6 py-3 text-left ">{cat.postCount}</td>
                      <td>
                        <form onSubmit={handleEditSubmit}>
                          <button
                            type="submit"
                            className="text-green-600 hover:text-green-800 font-medium mr-2"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelClick}
                            className="text-gray-600 hover:text-gray-800 font-medium"
                          >
                            Cancel
                          </button>
                        </form>
                      </td>
                    </>
                  ) : (
                    //readOnly
                    <>
                      <td className="px-6 py-3 text-left ">{cat.name}</td>
                      <td className="px-6 py-3 text-left ">{cat.postCount}</td>
                      {isAuthenticated ? (
                        <td className="px-6 py-3 text-left">
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="cursor-pointer mr-2"
                          >
                            🖋️
                          </button>
                          <button
                            disabled={cat.postCount > 0}
                            onClick={() => {
                              deleteCategory(cat.id);
                            }}
                            className={`mr-2 ${
                              cat.postCount > 0
                                ? " opacity-20 "
                                : "cursor-pointer"
                            }`}
                          >
                            ❌
                          </button>
                        </td>
                      ) : (
                        <td>-</td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
