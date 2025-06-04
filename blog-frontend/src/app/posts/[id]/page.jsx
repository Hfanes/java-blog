"use client";
import { useAuth } from "@/components/AuthProvider";
import { useParams } from "next/navigation";
import { apiService } from "@/services/api";
import React, { useEffect, useState } from "react";
import { Clock, Calendar1, User, ArrowLeft, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
  const { token, isAuthenticated } = useAuth();

  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
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
  }, [id, token]);

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  const handleDeletePost = async (id) => {
    try {
      await apiService.deletePost(id);
      router.push("/");
    } catch (error) {
      console.log("Error deleting post", error);
    }
  };

  if (loading)
    return <div className="flex justify-center h-screen">Loading post...</div>;
  if (!post)
    return (
      <div className="flex justify-center h-screen">
        Post not found or still loading...
      </div>
    );

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="flex justify-center h-screen">Loading post...</div>
      ) : !post ? (
        <div className="flex justify-center h-screen">
          Post not found or still loading...
        </div>
      ) : (
        <div>
          <div className="pt-10 max-w-4xl mx-auto px-4 ">
            <div className="p-3 rounded border shadow p-4 bg-white">
              <div className="flex justify-between">
                <button
                  className="flex items-center gap-1 bg-gray-100 text-sm p-2 mb-4 rounded-md hover:bg-gray-200 transition cursor-pointer"
                  onClick={() => router.back()}
                >
                  <ArrowLeft size={16} />
                  Back to Posts
                </button>
                {isAuthenticated && (
                  <div className="flex gap-4 items-center">
                    <button
                      className="flex items-center gap-1 bg-gray-100 text-sm p-2 mb-4 rounded-md hover:bg-gray-200 transition cursor-pointer"
                      onClick={() => router.push(`/posts/${post.id}/edit`)}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-1 bg-red-100 text-sm p-2 mb-4 rounded-md hover:bg-red-200 transition cursor-pointer"
                      //TODO: ADD CONFIRM DIALOG
                      //router.push('/')
                      // onClick={
                      // }
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <Trash size={16} />
                      Delete
                    </button>
                    <Modal
                      isOpen={isDeleteModalOpen}
                      onClose={() => setIsDeleteModalOpen(false)}
                    >
                      <h2 className="text-lg font-bold mb-4">
                        Confirm Post deletion
                      </h2>
                      <p>Are you sure you want to delete this post?</p>
                      <div className="flex justify-between gap-2 mt-4">
                        <button
                          onClick={() => setIsDeleteModalOpen(false)}
                          className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleDeletePost(id);
                            setIsDeleteModalOpen(false);
                          }}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-black rounded cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </Modal>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div>{post.title}</div>
                <div>{post.content}</div>
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
      )}
    </ProtectedRoute>
  );
}
