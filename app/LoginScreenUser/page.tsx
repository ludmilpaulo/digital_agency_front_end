"use client";
import Image from "next/image";
import { css } from '@emotion/react';
import { motion } from "framer-motion";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { baseAPI } from "@/useAPI/api";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";

const headerStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;       
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
`;

const LoginScreenUser = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] =
    useState(false);
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);

  const toggleForgotPasswordDialog = () => {
    setShowForgotPasswordDialog(!showForgotPasswordDialog);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  let handleSubmit = async () => {

    console.log("login", JSON.stringify({
        username: username,
        password: password,
      }))
    try {
      setLoading(true);
      let res = await fetch(`${baseAPI}/account/custom-login/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      let resJson = await res.json();
      console.log(resJson)
      if (res.status === 200) {
        dispatch(loginUser(resJson));
        alert("Login successful!");
       
        router.push("/");
      } else if (resJson.is_customer === false) {
        dispatch(loginUser(resJson));
        router.push("/"); // Redirect to Dashboard
      } else {
        alert(Object.values(resJson));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="w-full min-h-screen px-4 py-16 flex items-center justify-center"
        style={{
          backgroundImage: `url(${headerData?.backgroundApp})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Transition
          show={loading}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {loading && (
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
              <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </Transition>
        
        <div className="relative flex flex-col items-center justify-center w-full max-w-md bg-white rounded shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src={headerData?.logo ?? "/default-logo.png"}
              alt="logo"
              width={100}
              height={100}
              className="w-32 h-32"
            />
          </div>
          {/* Login form */}
          <motion.div
            animate={{
              scale: [1, 1, 1, 1, 1],
              rotate: [0, 30, 60, 240, 360],
            }}
            className="w-full p-6"
          >
            <p className="text-2xl font-extrabold text-gray-800 mb-6">
            Sign in to your account
            </p>
            {/* Sign up link */}
            <Link href={"/SignupScreen"}>
              <p className="text-sm font-medium text-gray-500 mb-4 cursor-pointer">
              Don&apos;t have an account? Sign here
              </p>
            </Link>
            {/* Username input */}
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="w-full py-3 pl-3 text-sm font-medium text-black bg-gray-200 border rounded focus:outline-none mb-4"
            />
            {/* Password input */}
            <div className="relative">
              <input
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                className="w-full py-3 pl-3 text-sm font-medium text-black bg-gray-200 border rounded focus:outline-none mb-4"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* Login button */}
            <button
              onClick={handleSubmit}
              type="button"
              className="w-full py-3 text-sm font-semibold text-white bg-blue-500 border rounded focus:outline-none hover:bg-blue-600 mb-4"
            >
              Login to My Account
            </button>
            {/* Forgot password link */}
            <button
              onClick={toggleForgotPasswordDialog}
              className="text-sm text-blue-500 font-medium hover:underline focus:outline-none"
            >
             fogot password 
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginScreenUser;
