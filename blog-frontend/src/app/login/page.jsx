"use client";
import React from "react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginAction } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      loginAction({ email, password });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 ">
      <h1 className="font-bold text-2xl">Sign in to your account</h1>
      <form
        className="flex flex-col gap-2 max-w-sm w-full"
        onSubmit={handleSubmit}
      >
        <input
          className="border-2 mb-4 rounded-sm p-1.5"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          className="border-2 mb-4 rounded-sm  p-1.5"
          id="password"
          name="password"
          type="password"
          autoComplete="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button
          className="border px-6 py-2 rounded self-center bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
          type="submit"
        >
          Sign in
        </button>
      </form>
      <Link
        className="border px-6 py-2 rounded self-center bg-gray-300 hover:bg-gray-700 transition cursor-pointer"
        href="/register"
      >
        Don't have an account? Sign up
      </Link>
    </div>
  );
}
