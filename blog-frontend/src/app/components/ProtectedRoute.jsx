"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);
  if (!token) {
    return <div>Loading...</div>;
  }

  return children;
}
