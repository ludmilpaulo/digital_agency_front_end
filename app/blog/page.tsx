"use client";
import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import ShareButtons from "../../components/ShareButtons"; // Adjust the import path as needed
import {
  Post as PostType,
  Comment as CommentType,
  AboutUsData,
} from "@/useAPI/types"; // Adjust import paths as needed
import { baseAPI } from "@/useAPI/api"; // Adjust the base API URL as needed
import { fetchAboutUsData } from "@/useAPI/information";

import Link from "next/link";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseAPI}/post/blogs`);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (err) {
        setError(`Failed to load posts:`);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div
      className="mx-auto px-4 py-20"
      style={{
        backgroundImage: `url(${headerData?.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AnimatePresence>
        {loading && (
          <Transition
            show={loading}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
              <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          </Transition>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-56">
        {posts.map((post) => (
          <div
            key={post.id}
            className="cursor-pointer shadow-lg rounded-lg p-4 bg-white"
          >
            <Link
              href={{
                pathname: "/posts",
                query: {
                  postId: post.id,
                  title: post.title,
                  image: post.image,
                  description: post.content,
                },
              }}
            >
              <h2 className="text-xl font-bold">{post.title}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
