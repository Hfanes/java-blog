"use client";
import React from "react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

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
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <form
        className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email">Email:</label>
        <input
          className="border-2"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label htmlFor="password">Password:</label>
        <input
          className="border-2"
          id="password"
          name="password"
          type="password"
          autoComplete="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
