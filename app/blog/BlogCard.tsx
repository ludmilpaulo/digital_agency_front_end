import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types/blog";
import { FaRegCalendar } from "react-icons/fa";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.id}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full">
        {post.image && (
          <div className="h-48 w-full relative">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <FaRegCalendar /> {post.published_date?.slice(0,10)}
          </div>
          <h2 className="font-bold text-lg text-blue-800">{post.title}</h2>
          <div className="text-gray-700 line-clamp-3 flex-1">{stripHtml(post.content).slice(0,110)}…</div>
          <div className="mt-3 text-blue-600 font-semibold text-right">Read More</div>
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
