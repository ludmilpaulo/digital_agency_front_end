"use client";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types/blog";
import { FaRegCalendar } from "react-icons/fa";
import { getTagNames } from "@/utils/getTagNames";
import { useGetAboutUsQuery } from "@/redux/services/aboutUsApi";

export default function BlogCard({ post }: { post: Post }) {
  const { data: aboutUs } = useGetAboutUsQuery();
  const logo = aboutUs?.logo || "/logo.png";
  const tagNames = getTagNames(post.tags);

  return (
    <Link href={`/blog/${post.id}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full group border border-blue-100">
        <div className="h-48 w-full relative">
          <Image
            src={post.image || logo}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform bg-white"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <FaRegCalendar /> {post.published_date?.slice(0, 10)}
          </div>
          <h2 className="font-bold text-lg text-blue-800 line-clamp-2">{post.title}</h2>
          <div className="flex flex-wrap gap-2 my-2">
            {tagNames.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-gray-700 line-clamp-3 flex-1">
            {stripHtml(post.content).slice(0, 120)}…
          </div>
          <div className="mt-3 text-blue-600 font-semibold text-right group-hover:underline">
            Read More
          </div>
        </div>
      </div>
    </Link>
  );
}

// Helper to remove HTML tags for preview
function stripHtml(html: string) {
  if (!html) return "";
  if (typeof window !== "undefined") {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || "";
  }
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}
