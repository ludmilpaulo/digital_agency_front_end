"use client";
import { useState } from "react";
import { useAddCommentMutation } from "@/redux/services/blogApi";
import { FaUserCircle, FaSpinner, FaRegCommentDots } from "react-icons/fa";
import aiCommentBot from "@/utils/aiCommentBot";
import { Comment } from "@/types/blog";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function CommentsSection({
  postId,
  comments,
}: {
  postId: string | number;
  comments: Comment[];
}) {
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  // AI check (your demo as before)
  const aiResult = await aiCommentBot(form.content);
  if (aiResult.isSpam) {
    setError("Your comment was flagged as spam or inappropriate.");
    return;
  }
  try {
    await addComment({
      post: Number(postId),     // Must be sent to the backend!
      name: form.name,
      email: form.email,
      content: form.content,
    }).unwrap();
    setForm({ name: "", email: "", content: "" });
    setSuccess("Comment submitted! Awaiting moderation.");
    setShowForm(false);
  } catch (err: any) {
    setError("Failed to submit. Please try again.");
  }
};


  return (
    <section className="mt-12 md:mt-16 relative px-2">
      <h2 className="font-extrabold text-2xl mb-6 flex items-center gap-2 text-blue-700">
        <FaRegCommentDots /> Comments ({comments.length})
      </h2>

      {/* Comments */}
      <div className="space-y-6 mb-14">
        <AnimatePresence>
          {comments.length === 0 && (
            <motion.div
              key="no-comments"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-blue-50 border border-blue-100 text-blue-900 px-4 py-6 sm:px-6 rounded-xl shadow text-center text-base"
            >
              No comments yet — be the first to share your thoughts!
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {comments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 sm:gap-4 bg-white rounded-xl shadow p-4 sm:p-5 border border-gray-100"
            >
              <div className="pt-1 flex-shrink-0">
                <FaUserCircle className="text-3xl text-blue-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-blue-900 flex items-center gap-2 flex-wrap">
                  {c.name}
                  <span className="text-xs text-gray-400 font-normal whitespace-nowrap">
                    • {dayjs(c.created_date || c.created_at).fromNow()}
                  </span>
                </div>
                <div className="text-gray-700 text-[1.05rem] leading-relaxed mt-1 break-words">
                  {c.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Add Comment Button */}
      {!showForm && (
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex fixed bottom-8 right-4 z-40 items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg font-bold text-lg hover:bg-blue-800 transition"
          onClick={() => setShowForm(true)}
        >
          <FaRegCommentDots /> Add Comment
        </motion.button>
      )}

      {/* Add Comment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", duration: 0.5 }}
            onSubmit={handleSubmit}
            className="max-w-lg w-full mx-auto bg-white/90 backdrop-blur border border-blue-100 shadow-2xl rounded-2xl px-4 py-6 sm:px-8 sm:py-8 space-y-5"
          >
            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">Add a Comment</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                className="flex-1 border-b-2 border-blue-200 focus:border-blue-600 outline-none px-3 py-2 text-base rounded-t transition"
                placeholder="Your name"
                value={form.name}
                required
                maxLength={80}
                autoComplete="name"
                onChange={e => setForm({ ...form, name: e.target.value })}
                disabled={isLoading}
              />
              <input
                className="flex-1 border-b-2 border-blue-200 focus:border-blue-600 outline-none px-3 py-2 text-base rounded-t transition"
                type="email"
                placeholder="Your email"
                value={form.email}
                required
                maxLength={120}
                autoComplete="email"
                onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <textarea
              className="border-b-2 border-blue-200 focus:border-blue-600 outline-none w-full px-3 py-2 text-base rounded-t min-h-[90px] resize-vertical transition"
              placeholder="Write your comment…"
              value={form.content}
              required
              minLength={6}
              maxLength={800}
              onChange={e => setForm({ ...form, content: e.target.value })}
              disabled={isLoading}
            />
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 font-medium"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 font-medium"
              >
                {success}
              </motion.div>
            )}
            <div className="flex gap-4 mt-3 items-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg shadow font-bold flex items-center gap-2 transition hover:bg-blue-700 active:scale-95 ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isLoading && (
                  <FaSpinner className="animate-spin text-xl" />
                )}
                Post Comment
              </button>
              <button
                type="button"
                className="ml-3 text-blue-400 hover:underline font-medium"
                onClick={() => setShowForm(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Add comment inline on mobile */}
      {!showForm && (
        <button
          className="md:hidden mt-2 w-full bg-blue-600 hover:bg-blue-800 transition text-white rounded-lg py-3 font-bold text-lg shadow"
          onClick={() => setShowForm(true)}
        >
          <FaRegCommentDots className="inline mr-2" /> Add Comment
        </button>
      )}
    </section>
  );
}
