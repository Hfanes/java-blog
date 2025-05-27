"use client";
import React, { useEffect, useState } from "react";
import { apiService } from "@/services/api";

export default function tags() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getCategories();
        setCategories(response);
      } catch (error) {
        console.log("Error fetching categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  if (isLoading) return <div className="pt-20 text-center">Loading...</div>;
  return (
    <div>
      {categories.map((cat) => (
        <div className="pt-10 max-w-4xl mx-auto px-4">
          <div className="p-6 rounded border shadow bg-white">{cat.name}</div>
        </div>
      ))}
    </div>
  );
}
