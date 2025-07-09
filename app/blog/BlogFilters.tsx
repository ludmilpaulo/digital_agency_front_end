"use client";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useMemo } from "react";
import { Post } from "@/types/blog";
import { getTagNames } from "@/utils/getTagNames";

interface Props {
  search: string;
  setSearch: (val: string) => void;
  category: string | null;
  setCategory: (val: string | null) => void;
  posts: Post[];
}

export default function BlogFilters({ search, setSearch, category, setCategory, posts }: Props) {
  const categories = useMemo(
    () =>
      Array.from(
        new Set(posts.flatMap((p) => getTagNames(p.tags)))
      ).filter(Boolean),
    [posts]
  );

  return (
    <div className="flex gap-3 flex-wrap mb-6 justify-center">
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow">
        <FaSearch className="text-blue-300" />
        <input
          className="outline-none border-none bg-transparent min-w-[120px]"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {categories.map(cat => (
        <button
          key={cat}
          className={`px-3 py-1 rounded-full border transition font-medium ${
            category === cat
              ? "bg-blue-500 text-white border-blue-700 shadow"
              : "bg-white/90 text-blue-700 border-blue-300 hover:bg-blue-50"
          }`}
          onClick={() => setCategory(cat === category ? null : cat)}
        >
          <FaFilter className="inline mr-1" /> {cat}
        </button>
      ))}
    </div>
  );
}
