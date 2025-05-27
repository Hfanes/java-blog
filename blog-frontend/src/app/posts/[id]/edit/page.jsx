"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { apiService } from "@/services/api";

export default function page() {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const [categoriesResponse, tagsResponse] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags(),
        ]);

        setCategories(categoriesResponse);
        setTags(tagsResponse);
        console.log("categories", categories);
        console.log("tags", tags);
        if (id) {
          const fetchPost = await apiService.getPostById(id);
          setPost(fetchPost);
        }
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading)
    return <div className="flex justify-center h-screen">Loading post...</div>;

  if (!post)
    return <div className="flex justify-center h-screen">Post not found.</div>;
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-xl font-semibold mb-4">Edit Post {id}</h1>
      <form>
        <input
          type="text"
          name="title"
          required
          value={post.title}
          onChange={() => {}}
        ></input>
        <input
          type="text"
          name="title"
          required
          value={post.content}
          onChange={() => {}}
        ></input>

        <label>
          Category:
          <select name="taskPriority" value={post.category.name}>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tags:
          <select name="taskPriority" value={post.tags.map((tg) => tg.name)}>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 ">
          {post.tags.map((tag) => (
            <div
              key={tag.id}
              className="p-1 rounded-lg border border-gray-200 text-sm"
            >
              {tag.name}
            </div>
          ))}
        </div>
        <label>
          Status:
          <select name="taskPriority" value={post.status}>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </label>
      </form>
    </div>
  );
}
