"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Clock, Calendar1, User, ArrowLeft, Pencil, Trash } from "lucide-react";
import Modal from "@/components/Modal";
import { apiService } from "@/services/api";

export default function PostList({ posts }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleUlClick = (postId) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p> No posts found </p>
        ) : (
          posts.map((post) => (
            <ul
              key={post.id}
              className="cursor-pointer p-4 shadow rounded bg-white hover:scale-102"
              onClick={() => handleUlClick(post.id)}
            >
              <h2 className="mb-1">{post.title}</h2>
              <p className="flex items-center gap-1 mb-2">
                <User size={16} />
                by {post.author.name}
              </p>
              <p className="mb-4">{post.content}</p>
              <div className="flex gap-6">
                <div className="flex items-center gap-1">
                  <Calendar1 size={16} />
                  {formatDate(post.updatedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {post.readingTime} min read
                </div>
                <div className="flex gap-4">
                  {post.tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="p-1 mt-[-2px] rounded-lg border border-gray-200 text-sm"
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
              {post.author.id === user?.id && isAuthenticated && (
                <div className="flex justify-between mt-4">
                  {isAuthenticated && (
                    <div className="flex gap-4 items-center">
                      <button
                        className="flex items-center gap-1 bg-gray-100 text-sm p-2 mb-4 rounded-md hover:bg-gray-200 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/posts/${post.id}/edit`);
                        }}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-100 text-sm p-2 mb-4 rounded-md hover:bg-red-200 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDeleteModalOpen(true);
                        }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDeleteModalOpen(false);
                            }}
                            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(post.id);
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
              )}
            </ul>
          ))
        )}
      </div>
    </>
  );
}
