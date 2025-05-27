"use client";
import { useAuth } from "@/components/AuthProvider";
import { useParams } from "next/navigation";
import { apiService } from "@/services/api";
import React, { useEffect, useState } from "react";
import { Clock, Calendar1, User, ArrowLeft, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { token, isAuthenticated } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const fetchedPost = await apiService.getPostById(id);
        setPost(fetchedPost);
        console.log(fetchPost);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  if (loading)
    return <div className="flex justify-center h-screen">Loading post...</div>;

  if (!post)
    return <div className="flex justify-center h-screen">Post not found.</div>;

  return (
    <div>
      <div className="pt-10 max-w-4xl mx-auto px-4 ">
        <div className="p-3 rounded border shadow p-4 bg-white">
          <div className="flex justify-between ">
            <button
              className="flex items-center gap-1 bg-gray-100 text-sm p-2 mb-4 rounded-md hover:bg-gray-200 transition"
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} />
              Back to Posts
            </button>
            {isAuthenticated && (
              <div className="flex gap-4 items-center">
                <button
                  className="flex items-center gap-1 bg-gray-100 text-sm p-2 mb-4 rounded-md hover:bg-gray-200 transition"
                  onClick={() => router.push(`/posts/${post.id}/edit`)}
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  className="flex items-center gap-1 bg-red-100 text-sm p-2 mb-4 rounded-md hover:bg-red-200 transition"
                  //TODO: ADD CONFIRM DIALOG
                  //router.push('/')
                  // onClick={
                  // }
                >
                  <Trash size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div>{post.title}</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User size={16} />
                {post.author.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar1 size={16} />
                {formatDate(post.readingTime)}{" "}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                {post.readingTime} min read
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
