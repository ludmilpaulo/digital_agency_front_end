"use client";
import { useParams } from "next/navigation";
import { useGetPostQuery, useGetCommentsQuery, useAddCommentMutation } from "@/redux/services/blogApi";
import StickySidebar from "@/components/StickySidebar";
import BlogPostContent from "../BlogPostContent";
import CommentsSection from "../CommentsSection";
import AIChatBot from "../AIChatBot";


export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const { data: post, isLoading } = useGetPostQuery(params.id);
  const { data: comments = [] } = useGetCommentsQuery(params.id);

  return (
    <main className="max-w-7xl mx-auto pt-36 pb-16 px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Main Blog */}
      <section className="md:col-span-8">
        {isLoading || !post
          ? <div className="text-blue-400">Loading…</div>
          : <BlogPostContent post={post} />}
        {/* Comments, Chat */}
        <CommentsSection postId={params.id} comments={comments} />
        <div className="mt-10">
          <AIChatBot contextType="post" contextId={params.id} />
        </div>
      </section>
      {/* Sidebar */}
      <aside className="md:col-span-4">
        <StickySidebar post={post} />
      </aside>
    </main>
  );
}
