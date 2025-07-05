import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import AuthorBio from "./AuthorBio";
import ShareButtons from "@/components/ShareButtons";
import { Post, Comment} from '@/types/blog';
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function BlogPostContent({ post }: { post: Post }) {
  return (
    <article>
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
        <Image src={post.author?.avatar || "/default-avatar.png"} alt={post.author?.name || "Author"} width={32} height={32} className="rounded-full" />
        <span>{post.author?.name || "Maindo Digital"}</span>
        <span>• {post.published_date?.slice(0, 10)}</span>
      </div>
      {post.image && (
        <div className="w-full h-72 relative mb-6">
          <Image src={post.image} alt={post.title} fill className="object-cover rounded-xl" />
        </div>
      )}
      <ReactMarkdown className="prose lg:prose-lg mb-7">
        {post.content}
      </ReactMarkdown>
      <ShareButtons url={typeof window !== "undefined" ? window.location.href : ""} title={post.title} />
      <AuthorBio author={post.author} />
      {/* Related posts, badges, etc */}
    </article>
  );
}
