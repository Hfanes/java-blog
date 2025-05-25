import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Posts() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        Posts
      </div>
    </ProtectedRoute>
  );
}
