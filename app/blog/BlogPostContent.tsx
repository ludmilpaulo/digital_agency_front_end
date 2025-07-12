"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import AuthorBio from "./AuthorBio";
import ShareButtons from "@/components/ShareButtons";
import { Post } from "@/types/blog";
import { useGetAboutUsQuery } from "@/redux/services/aboutUsApi";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

export default function BlogPostContent({ post }: { post: Post }) {
  const { data: aboutUs } = useGetAboutUsQuery();
  const logo = aboutUs?.logo || "/logo.png";

  // Prefer post.author?.avatar, fallback to logo if not found
  const authorAvatar = post.author?.avatar || logo;
  const authorName = post.author?.name || aboutUs?.title || "Maindo Digital";

  // Get excerpt (plain text, 200 chars max) for sharing
  function getExcerpt() {
    if (post.markdown) {
      // Remove markdown syntax for excerpt
      return post.markdown.replace(/[#_*>\-\[\]`]/g, "").slice(0, 200);
    }
    // Strip HTML tags for excerpt
    return post.content
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 200);
  }

  return (
    <article className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-blue-950">{post.title}</h1>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
        <Image
          src={authorAvatar}
          alt={authorName}
          width={36}
          height={36}
          className="rounded-full bg-white border object-contain"
        />
        <span className="font-semibold">{authorName}</span>
        <span>• {post.published_date?.slice(0, 10)}</span>
      </div>
      {/* Post image or logo fallback */}
      <div className="w-full h-64 relative mb-6 rounded-xl overflow-hidden">
        <Image
          src={post.image || logo}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
      </div>
      <div className="prose prose-blue max-w-none mb-7 dark:prose-invert text-lg leading-relaxed">
        {post.markdown ? (
          <ReactMarkdown>{post.markdown}</ReactMarkdown>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </div>
      <ShareButtons
        url={typeof window !== "undefined" ? window.location.href : ""}
        title={post.title}
        excerpt={getExcerpt()}
      />
      <AuthorBio author={post.author} logo={logo} aboutUs={aboutUs} />
    </article>
  );
}
