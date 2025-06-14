"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { User } from "lucide-react";
import { apiService } from "@/services/api";

export default function Navbar() {
  const { user, isAuthenticated, logoutAction } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // mark client mount complete
  }, []);

  useEffect(() => {
    setOpen(false);
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        //if menu exists and is clicked outside
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    //when unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefresh = async () => {
    try {
      const data = await apiService.refresh();
      console.log("Token refreshed!", data);
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-16 flex justify-between items-center shadow-md px-8 bg-white z-100">
      <Link href="/">Blog Platform</Link>
      <div>
        <ul className="flex gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/categories">Categories</Link>
          </li>
          <li>
            <Link href="/tags">Tags</Link>
          </li>
        </ul>
      </div>
      <div>
        {isAuthenticated ? (
          <div className="flex gap-4 ">
            <Link
              href="/posts/drafts"
              className="cursor-pointer bg-purple-100 text-sm p-2  rounded-md hover:bg-purple-200 transition"
            >
              Draft Posts
            </Link>
            <Link
              href="/posts//my-posts"
              className="cursor-pointer bg-blue-100 text-sm p-2  rounded-md hover:bg-blue-200 transition"
            >
              🖋️ My Posts
            </Link>
            <Link
              href="/posts/new"
              className="cursor-pointer bg-blue-100 text-sm p-2  rounded-md hover:bg-blue-200 transition"
            >
              + New Post
            </Link>
            <div className="relative inline-block" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700"
              >
                <User size={16} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-10">
                  <div className="px-4 py-2 hover:bg-gray-100 rounded-xl cursor-pointer text-blue-600">
                    🧑 {user.name}
                  </div>
                  <Link
                    href="/posts/drafts"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-xl cursor-pointer"
                  >
                    🖋️ My Drafts
                  </Link>
                  <Link
                    href="/posts/my-posts"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-xl cursor-pointer"
                  >
                    🖋️ My Posts
                  </Link>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 rounded-xl cursor-pointer text-red-600"
                    onClick={logoutAction}
                  >
                    🚪 Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="text-black cursor-pointer px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-700 hover:text-white"
              href="/register"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
