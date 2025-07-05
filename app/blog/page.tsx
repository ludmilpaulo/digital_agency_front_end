"use client";
import { useGetPostsQuery } from "@/redux/services/blogApi";
import BlogCard from "./BlogCard";
import BlogFilters from "./BlogFilters";
import { useState, useMemo } from "react";

export default function BlogPage() {
  const { data: posts = [], isLoading } = useGetPostsQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // AI smart search/filter logic
  const filtered = useMemo(() => {
    if (!search && !category) return posts;
    // (Replace with AI-powered logic)
    return posts.filter(
      p =>
        (!category || p.tags?.includes(category)) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) ||
         p.content.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, category, posts]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900/70 to-gray-950/70 py-28 px-4">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">Maindo Digital Blog</h1>
      <BlogFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        posts={posts}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? <div className="text-blue-200">Loading...</div>
          : filtered.map((post) => <BlogCard key={post.id} post={post} />)
        }
      </div>
    </main>
  );
}
