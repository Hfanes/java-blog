import Image from "next/image";
import PostList from "@/components/PostList";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <PostList />
    </div>
  );
}
