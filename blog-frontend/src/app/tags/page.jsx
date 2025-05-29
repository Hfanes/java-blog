"use client";
import React, { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { useAuth } from "@/components/AuthProvider";
import Modal from "@/components/Modal";

export default function tags() {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [editingTagId, setEditingTagId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [tagName, setTagNames] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getTags();
        setTags(response);
      } catch (error) {
        console.log("Error fetching categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleEditClick = (tag) => {
    setEditingTagId(tag.id);
    setEditForm({
      name: tag.name || "",
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
    setEditingTagId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseTagUpdated = await apiService.updateTag(editingTagId, {
        id: editingTagId,
        name: editForm.name,
      });

      // Create a new array with all the categories except the one being edited, if id matches, update the tag
      setTags(
        tags.map((tag) => (tag.id === editingTagId ? responseTagUpdated : tag))
      );
      // Exit edit mode
      setEditingTagId(null);
    } catch (error) {
      console.log("Error editing tag", error);
    }
  };

  const deleteTag = async (tagId) => {
    try {
      await apiService.deleteTag(tagId);
      setTags(tags.filter((tag) => tag.id !== tagId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNewTag = async () => {
    try {
      const responseNewTag = await apiService.createTag({
        names: [tagName],
      });

      // Add the new tag to the list
      setTags((prevTags) => [...prevTags, responseNewTag]);
      setTagNames(""); // Clear input
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
            <h1 className="text-2xl font-semibold mb-4">Tags</h1>
            <button
              onClick={() => setIsOpen(true)}
              className="border bg-blue-400 p-2 rounded-xl mb-4 text-white cursor-pointer"
            >
              + New Tags
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <h2 className="text-lg font-bold mb-4">Add Tag</h2>
              <input
                minLength={2}
                type="text"
                value={tagName}
                onChange={(e) => setTagNames(e.target.value)}
                aria-label="Enter tags"
                placeholder="Type and press Enter or comma to add tags"
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
                  onClick={handleNewTag}
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
              {tags.map((tag) => (
                <tr key={tag.id}>
                  {editingTagId === tag.id ? (
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
                      <td className="px-6 py-3 text-left ">{tag.postCount}</td>
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
                      <td className="px-6 py-3 text-left ">{tag.name}</td>
                      <td className="px-6 py-3 text-left ">{tag.postCount}</td>
                      {isAuthenticated ? (
                        <td className="px-6 py-3 text-left">
                          <button
                            onClick={() => handleEditClick(tag)}
                            className="cursor-pointer mr-2"
                          >
                            🖋️
                          </button>
                          <button
                            disabled={tag.postCount > 0}
                            onClick={() => {
                              deleteTag(tag.id);
                            }}
                            className={`mr-2 ${
                              tag.postCount > 0
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
