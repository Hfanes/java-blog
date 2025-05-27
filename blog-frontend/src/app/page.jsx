"use client";
import Image from "next/image";
import PostList from "@/components/PostList";
import { apiService } from "@/services/api";

import { useState, useEffect } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedTagId, setSelectedTagId] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const queryParams = {};
        if (selectedCategoryId) queryParams.categoryId = selectedCategoryId;
        if (selectedTagId) queryParams.tagId = selectedTagId;
        const [postsResponse, categoriesResponse, tagsResponse] =
          await Promise.all([
            apiService.getPosts(queryParams),
            apiService.getCategories(),
            apiService.getTags(),
          ]);
        setPosts(postsResponse);
        setCategories(categoriesResponse);
        setTags(tagsResponse);
        console.log(categories);
        console.log(tags);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategoryId, selectedTagId]);
  if (loading) return <div className="pt-20 text-center">Loading...</div>;
  return (
    <>
      <div className="pt-10 max-w-4xl mx-auto px-4">
        <div className="p-6 rounded border shadow bg-white">
          <h1 className="text-2xl font-semibold mb-4">Blog Posts</h1>
          <div className="flex gap-4 mb-4">
            <div>
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`cursor-pointer hover:text-gray-600  transition-colors duration-200 border-b-2 ${
                  selectedCategoryId === null
                    ? "border-blue-600 font-semibold"
                    : "border-transparent"
                }`}
              >
                All posts
              </button>
            </div>
            {categories.length === 0 && <div>No categories found.</div>}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`cursor-pointer hover:text-gray-600  transition-colors duration-200 border-b-2 ${
                  selectedCategoryId === category.id
                    ? "border-blue-600 font-semibold"
                    : "border-transparent"
                }`}
              >
                {category.name} <span>({category.postCount})</span>
              </button>
            ))}
          </div>
          <div className="flex gap-4 mb-4">
            {tags.length === 0 && <div>No tags found.</div>}
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() =>
                  setSelectedTagId(selectedTagId === tag.id ? null : tag.id)
                }
                className={`cursor-pointer p-1 rounded-lg border border-gray-200 
                  hover:text-gray-600  transition-colors duration-200 border-b-2 ${
                    selectedTagId === tag.id ? "bg-blue-400" : ""
                  }`}
              >
                {tag.name} <span>({tag.postCount})</span>
              </button>
            ))}
          </div>

          <PostList posts={posts} />
        </div>
      </div>
    </>
  );
}
