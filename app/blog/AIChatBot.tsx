"use client";
import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

interface AIChatBotProps {
  contextType?: string;
  contextId?: string;
}

const exampleAnswers = [
  "Hi! How can I help you with this post?",
  "Would you like a summary or have a question?",
  "Feel free to ask me about web, digital, or Maindo services!"
];

export default function AIChatBot({ contextType, contextId }: AIChatBotProps) {
  const [messages, setMessages] = useState([
    { from: "bot", text: exampleAnswers[Math.floor(Math.random() * exampleAnswers.length)] }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setLoading(true);

    // Here you can use OpenAI or your backend for smart answers.
    setTimeout(() => {
      setMessages(msgs =>
        [...msgs, { from: "bot", text: "🤖 (AI) Sorry, I’m just a demo for now!" }]
      );
      setLoading(false);
    }, 1000);
    setInput("");
  };

  return (
    <div className="border rounded-xl shadow-lg bg-white/90 p-4 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-3 text-blue-600 font-bold">
        <FaRobot /> AI Assistant
        <span className="text-xs text-gray-500 ml-2">
          {contextType && `Context: ${contextType} ${contextId || ""}`}
        </span>
      </div>
      <div className="max-h-64 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.from === "user"
                ? "text-right"
                : "text-left text-blue-700"
            }
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.from === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-blue-50"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left text-blue-700">
            <span className="inline-block px-3 py-2 rounded-lg bg-blue-50 animate-pulse">
              Thinking...
            </span>
          </div>
        )}
      </div>
      <form className="flex gap-2" onSubmit={sendMessage}>
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about this post..."
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <FaPaperPlane /> Send
        </button>
      </form>
    </div>
  );
}
