"use client";
import React from "react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { registerAction } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      registerAction({ email, name, password });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 ">
      <h1 className="font-bold text-2xl">Register</h1>
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
          className="border-2 mb-4 rounded-sm p-1.5"
          id="name"
          name="name"
          type="name"
          autoComplete="name"
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          Register
        </button>
      </form>
    </div>
  );
}
