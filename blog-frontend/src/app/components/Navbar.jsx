"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { token, logoutAction } = useAuth();
  return (
    <div className="fixed top-0 flex justify-between items-center w-full h-16 shadow-md px-8 cursor-pointer bg-white">
      <Link href="/">Blog Platform</Link>
      <div>
        <ul className="flex gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/posts">Categories</Link>
          </li>
          <li>
            <Link href="/">Tags</Link>
          </li>
        </ul>
      </div>
      <div>
        {token ? (
          <div className="flex gap-4">
            <button onClick={logoutAction}>Logout</button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
}
