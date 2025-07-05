// components/StickySidebar.tsx
"use client";
import { Post } from "@/types/blog";
import Link from "next/link";

interface StickySidebarProps {
  post?: Post;
}

export default function StickySidebar({ post }: StickySidebarProps) {
  if (!post) return null;

  // Example: show post info (tags, category, author, published_date)
  return (
    <aside className="sticky top-24 h-fit bg-white border rounded-xl shadow p-4 flex flex-col gap-5 min-w-[260px]">
      <div>
        <div className="font-semibold text-blue-700 mb-1">Published</div>
        <div className="text-gray-700 text-sm mb-2">
          {post.published_date?.slice(0, 10)}
        </div>
      </div>

      {post.category && (
        <div>
          <div className="font-semibold text-blue-700 mb-1">Category</div>
          <div className="text-sm">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{(post as any).category.name || "Blog"}</span>
          </div>
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div>
          <div className="font-semibold text-blue-700 mb-1">Tags</div>
          <div className="flex gap-2 flex-wrap">
            {(post.tags as string[]).map((t) => (
              <span key={t} className="bg-blue-100 text-blue-700 px-2 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add related posts, author, newsletter, or ad blocks here! */}
      <div className="mt-4">
        <Link
          href="/blog"
          className="block text-center bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg py-2 font-bold shadow"
        >
          ← Back to Blog
        </Link>
      </div>
    </aside>
  );
}
