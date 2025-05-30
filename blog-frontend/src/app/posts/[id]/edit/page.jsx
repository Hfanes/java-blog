"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import Tiptap from "@/components/TipTap";
import { Clock, Calendar1, User, ArrowLeft, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function page() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "DRAFT",
  });

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedPost, allCategories, allTags] = await Promise.all([
          apiService.getPostById(id),
          apiService.getCategories(),
          apiService.getTags(),
        ]);
        setPost(fetchedPost);
        setForm({
          title: fetchedPost.title,
          content: fetchedPost.content,
          status: fetchedPost.status,
        });
        setSelectedCategory(fetchedPost.category);
        setSelectedTags(fetchedPost.tags); // full objects
        setCategories(allCategories);
        setTags(allTags);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagSelect = (e) => {
    const tagId = e.target.value;
    if (!tagId) return;

    const tag = tags.find((t) => t.id === tagId);
    if (!tag) return;

    setSelectedTags((prev) => [...prev, tag]);
    e.target.value = ""; // Reset dropdown
  };

  const handleRemoveTag = (id) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.updatePost(id, {
        postId: post.id,
        title: form.title,
        content: form.content,
        status: form.status,

        categoryId: selectedCategory.id,
        tagIds: selectedTags.map((tag) => tag.id),
      });
      router.push(`/posts/${id}`);
      console.log({
        title: form.title,
        content: form.content,
        status: form.status,
        categoryId: selectedCategory?.id,
        tagIds: selectedTags.map((tag) => tag.id),
      });
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  const unselectedTags = tags.filter(
    (tag) => !selectedTags.some((selected) => selected.id === tag.id)
  );

  return (
    <ProtectedRoute>
      {isLoading && (
        <>
          <div className="flex justify-center h-screen">Loading post...</div>
        </>
      )}
      {!post && (
        <>
          <div className="flex justify-center h-screen">Post not found</div>
        </>
      )}
      <div className="max-w-3xl mx-auto py-10 px-4 bg-white-400">
        <div className="p-3 rounded border shadow bg-white gap-2">
          <div className="flex items-center p-3">
            <button
              className="flex items-center gap-1 bg-gray-100 text-sm p-2 mb-4 rounded-md hover:bg-gray-200 transition cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} />
              Back to Posts
            </button>
            <h1 className="text-xl font-semibold mb-4">Edit Post {id}</h1>
          </div>
          <form className="flex flex-col gap-4 rounded bg-white p-4">
            <label className="block font-medium">Title</label>
            <input
              aria-label="Title"
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 rounded-xl bg-gray-100 cursor-write hover:bg-gray-200"
            ></input>
            {/* <Tiptap post={post} /> */}
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Content"
              className="w-full border p-2 rounded h-40"
            />
            <label className="block font-medium">Category</label>
            <select
              id="category-select"
              value={selectedCategory?.id || ""}
              onChange={(e) => {
                const cat = categories.find((c) => c.id === e.target.value);
                setSelectedCategory(cat);
              }}
              className="w-full p-2 rounded-xl bg-gray-100 cursor-pointer"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <label className="block font-medium">Tags</label>
            <select
              onChange={handleTagSelect}
              className="w-full p-2 rounded-xl bg-gray-100 cursor-pointer"
              value="" // always reset to the placeholder option after selection
            >
              <option value="" disabled>
                {selectedTags.length > 0
                  ? selectedTags.map((tag) => tag.name).join(", ")
                  : ""}
              </option>

              {/* Unselected tags as options */}
              {unselectedTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2 flex-wrap mt-2">
              {selectedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="px-2 py-1 bg-blue-100 rounded-full text-sm flex items-center gap-2"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="text-red-600 hover:underline"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 rounded-xl bg-gray-100 cursor-pointer "
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-red-100 text-sm p-2 mb-4 rounded-md hover:bg-red-200 transition cursor-pointer text-red-800"
                onClick={() => {
                  router.push(`/posts/${id}`);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-400 text-sm p-2 mb-4 rounded-md hover:bg-blue-500 transition cursor-pointer text-white"
                type="submit"
                onClick={handleSubmit}
              >
                Update Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
