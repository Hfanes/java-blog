"use client";

import React from "react";
import { Clock, Calendar1 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PostList({ posts }) {
  const router = useRouter();

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
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
              onClick={() => {
                router.push(`/posts/${post.id}`);
              }}
            >
              <h2 className="mb-1">{post.title}</h2>
              <p>by {post.author.name}</p>
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
            </ul>
          ))
        )}
      </div>
    </>
  );
}
