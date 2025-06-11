"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth();

  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [token, router, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return null;
  }

  return children;
}
