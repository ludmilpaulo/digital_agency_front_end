// components/ScrollToTop.tsx
"use client";
import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return visible ? (
    <button
      className="fixed bottom-6 right-5 bg-blue-700 text-white rounded-full p-3 shadow-lg z-50 hover:bg-blue-900 transition"
      style={{ outline: "none" }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      <FaChevronUp size={20} />
    </button>
  ) : null;
}
