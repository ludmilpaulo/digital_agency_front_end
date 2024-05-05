"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ShareButtons from "../../components/ShareButtons"; // Adjust the import path as needed
import {
  Post as PostType,
  Comment as CommentType,
  AboutUsData,
} from "@/useAPI/types"; // Adjust import paths as needed
import { baseAPI } from "@/useAPI/api";

import { fetchAboutUsData } from "@/useAPI/information";
import { FaChevronDown } from "react-icons/fa";

function PostDetails() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(true);
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
  });

  const postId = searchParams.get("postId") || "";
  const title = searchParams.get("title") || ""; // Provide a default value if null
  const image = searchParams.get("image") || ""; // Provide a default value if null
  const content = searchParams.get("description") || ""; // Provide a default value if null
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${baseAPI}/post/blog/${postId}/comments`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseAPI}/post/posts/${postId}/comments/`,
        formData
      );
      if (response.status === 201) {
        alert(" Thanks for your comment");
        setComments([...comments, response.data]);
        setFormData({ name: "", email: "", content: "" }); // Clear form fields
      } else {
        throw new Error("Failed to post comment");
      }
    } catch (err) {
      console.error(`Error posting comment: ${err}`);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center pt-56 pb-12 md:px-6 px-4">
      <div className="w-full md:w-1/2 md:pr-8">
        <Image
          alt={title}
          src={image}
          width={320}
          height={400}
          layout="responsive" />
      </div>
      <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-8">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm leading-none text-gray-600">{title}</p>
          <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mt-2">
            {title}
          </h1>
        </div>

        <button
          className="focus:outline-none text-white focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 cursor-pointer rounded mt-4"
          aria-label="Show or hide details"
          onClick={() => setShow(!show)}
        >
          <FaChevronDown
            className={"transform " + (show ? "rotate-180" : "rotate-0")} />
        </button>
        {show && (
          <>
            <div
              className="mt-4 bg-white"
              dangerouslySetInnerHTML={{ __html: content || "" }} />
            <h2 className="text-center text-xl font-semibold mt-4">
              Share to Social Media
            </h2>
            <ShareButtons
              url={`https://www.maindodigital.com/${postId}`}
              title={title} />
          </>
        )}
        <button
          onClick={openModal}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Comment
        </button>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Post a Comment
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                        className="w-full p-2 border rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        required
                        className="w-full p-2 border rounded mt-2"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      <textarea
                        name="content"
                        placeholder="Write a comment..."
                        required
                        className="w-full p-2 border rounded mt-2"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                      <div className="mt-4 flex justify-end">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        {comments.map((comment) => (
          <div key={comment.id} className="mt-4 p-2 border-t border-gray-200">
            <strong>{comment.name}:</strong> {comment.content}
          </div>
        ))}
      </div>
    </div>
  );
}

const SuspensePostDetails = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PostDetails />
  </Suspense>
);

export default SuspensePostDetails;