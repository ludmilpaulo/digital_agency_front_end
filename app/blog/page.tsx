"use client";
import { useGetPostsQuery } from "@/redux/services/blogApi";
import BlogCard from "./BlogCard";
import BlogFilters from "./BlogFilters";
import { useState, useMemo } from "react";
import { getTagNames } from "@/utils/getTagNames";

const ITEMS_PER_PAGE = 9;

export default function BlogPage() {
  const { data: posts = [], isLoading } = useGetPostsQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Filtered posts
  const filtered = useMemo(() => {
    let filtered = posts;
    if (category) {
      filtered = filtered.filter(p => getTagNames(p.tags).includes(category));
    }
    if (search) {
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  }, [search, category, posts]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filter/search changes
  function handleFilterChange(fn: () => void) {
    fn();
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900/70 to-gray-950/70 py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Maindo Digital Blog</h1>
        <BlogFilters
          search={search}
          setSearch={val => handleFilterChange(() => setSearch(val))}
          category={category}
          setCategory={val => handleFilterChange(() => setCategory(val))}
          posts={posts}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? <div className="text-blue-200 col-span-full text-center text-lg">Loading...</div>
            : paginated.map((post) => <BlogCard key={post.id} post={post} />)
          }
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded border border-blue-400 bg-white text-blue-800 hover:bg-blue-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white/80">
              Page <b>{page}</b> of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded border border-blue-400 bg-white text-blue-800 hover:bg-blue-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
