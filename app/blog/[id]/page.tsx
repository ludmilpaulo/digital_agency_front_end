"use client";
import { useParams } from "next/navigation";
import { useGetPostQuery, useGetCommentsQuery } from "@/redux/services/blogApi";
import StickySidebar from "@/components/StickySidebar";
import BlogPostContent from "../BlogPostContent";
import CommentsSection from "../CommentsSection";
import AIChatBot from "../AIChatBot";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const { data: post, isLoading } = useGetPostQuery(params.id);
  const { data: comments = [] } = useGetCommentsQuery(params.id);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900/70 to-gray-950/70 pt-32 pb-20 px-2 md:px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Main Blog Content */}
        <section className="md:col-span-8 flex flex-col gap-8">
          <AnimatePresence>
            {isLoading || !post ? (
              <motion.div
                className="flex items-center justify-center min-h-[350px] text-blue-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="animate-spin w-8 h-8 mr-2" />
                Loading…
              </motion.div>
            ) : (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <BlogPostContent post={post} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comments & Chatbot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CommentsSection postId={params.id} comments={comments} />
            <div className="mt-10">
              <AIChatBot contextType="post" contextId={params.id} />
            </div>
          </motion.div>
        </section>

        {/* Sidebar */}
        <aside className="md:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <StickySidebar post={post} />
          </motion.div>
        </aside>
      </div>
    </main>
  );
}
