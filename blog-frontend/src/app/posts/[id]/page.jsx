"use client";
import { useAuth } from "@/components/AuthProvider";
import { useParams } from "next/navigation";
import api from "@/services/api";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { token, isAuthenticated } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {isAuthenticated ? (
        //able edit
        <></>
      ) : (
        //no edit
        <>
          <h1>Post ID: {id}</h1>
        </>
      )}
    </div>
  );
}
