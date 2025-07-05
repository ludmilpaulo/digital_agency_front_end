import { useState } from "react";
import { useAddCommentMutation } from "@/redux/services/blogApi";

import { FaUserCircle } from "react-icons/fa";
import aiCommentBot from "@/utils/aiCommentBot";
import {  Comment} from '@/types/blog';

export default function CommentsSection({ postId, comments }: { postId: string | number; comments: Comment[] }) {
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // AI check
    const aiResult = await aiCommentBot(form.content);
    if (aiResult.isSpam) {
      setError("Your comment was flagged as spam or inappropriate.");
      return;
    }
    await addComment({ postId: Number(postId), data: form });
    setForm({ name: "", email: "", content: "" });
    setError(null);
  };

  return (
    <div className="mt-12">
      <h2 className="font-bold text-xl mb-2">Comments</h2>
      {comments.map((c) => (
        <div key={c.id} className="flex items-start gap-2 mb-5">
          <FaUserCircle className="text-2xl text-blue-200" />
          <div>
            <div className="font-semibold">{c.name}</div>
            <div className="text-gray-600 text-sm">{c.content}</div>
          </div>
        </div>
      ))}
      <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
        <input
          className="border rounded px-3 py-2"
          placeholder="Your name"
          value={form.name}
          required
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Your email"
          required
          onChange={e => setForm({ ...form, email: e.target.value })}
          value={form.email}
        />
        <textarea
          className="border rounded px-3 py-2 min-h-[80px]"
          placeholder="Comment…"
          required
          onChange={e => setForm({ ...form, content: e.target.value })}
          value={form.content}
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" disabled={isLoading} className="bg-blue-500 text-white rounded py-2 px-4">Add Comment</button>
      </form>
    </div>
  );
}
