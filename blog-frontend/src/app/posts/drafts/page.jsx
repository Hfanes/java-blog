"use client";
import Image from "next/image";
import PostList from "@/components/PostList";
import { apiService } from "@/services/api";
import { Clock, Calendar1, User, ArrowLeft, Pencil, Trash } from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function page() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token } = useAuth();

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       setLoading(true);
  //       const queryParams = {};
  //       // if (selectedCategoryId) queryParams.categoryId = selectedCategoryId;
  //       // if (selectedTagId) queryParams.tagId = selectedTagId;
  //       // const [postsResponse, categoriesResponse, tagsResponse] =
  //       //   await Promise.all([
  //       //     apiService.getPosts(queryParams),
  //       //     apiService.getCategories(),
  //       //     apiService.getTags(),
  //       //   ]);
  //       setPosts(postsResponse);
  //       // setCategories(categoriesResponse);
  //       // setTags(tagsResponse);
  //     } catch (err) {
  //       console.error("Error fetching posts", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchPosts();
  // }, [selectedCategoryId, selectedTagId]);

  useEffect(() => {
    if (!token) return;
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsResponse = await apiService.getPostDrafts();
        setPosts(postsResponse);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token]);
  if (loading) return <div className="pt-20 text-center">Loading...</div>;
  return (
    <ProtectedRoute>
      {loading && <div className="pt-20 text-center">Loading...</div>}
      <div className="pt-10 max-w-4xl mx-auto px-4">
        <div className="p-6 rounded border shadow bg-white">
          <div className="flex gap-4">
            <button
              className="flex items-center gap-1 bg-gray-100 text-sm p-2 mb-4 rounded-md hover:bg-gray-200 transition cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} />
              Back to Posts
            </button>
            <h1 className="text-2xl font-semibold mb-4">My Blog Posts</h1>
          </div>
          <PostList posts={posts} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
