"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Eye, EyeOff } from "lucide-react";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";
import { baseAPI } from "@/useAPI/api";

const SignupScreen = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  
  });
  const [loading, setLoading] = useState(false);
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);
  
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prevState) => ({ ...prevState, [name]: value }));
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    const userData = {
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
      // Include other data as necessary
    };

    console.log("my data", userData)
  
    try {
      const response = await axios.post(`${baseAPI}/auth/users/`, userData);
      console.log('Registration successful:', response.data);
      router.push('/'); // Redirect to login page or wherever appropriate
    } catch (error) {
      alert("something went wrong please try again ");
      // Add error handling logic here
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
    style={{
        backgroundImage: `url(${headerData?.backgroundApp})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
     className="w-full min-h-screen px-4 py-16 flex items-center justify-center">
      <div className="relative flex flex-col items-center justify-center w-full max-w-lg bg-white rounded shadow-lg">
        <motion.div
          animate={{
            scale: [1, 1, 1, 1, 1],
            rotate: [0, 30, 60, 240, 360],
          }}
          className="p-10 lg:w-2/3 md:w-2/3"
        >
          <div className="flex justify-center mb-6">
            <Image
              src={headerData?.logo || "/default-logo.png"}
              alt="logo"
              width={100}
              height={100}
              className="w-64 h-64"
            />
          </div>
          <h1 className="text-2xl font-extrabold leading-6 text-gray-800">
          Sign Up for an Account
          </h1>

          <Link href={"/LoginScreenUser"}>
            <p className="mt-4 text-sm font-medium leading-none text-gray-500">
            If you have an account?{" "}
              <span className="text-gray-800 underline cursor-pointer">
                Login
              </span>
            </p>
          </Link>


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
              <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full">
                <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </Transition>

          {!loading && (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                name="username"
                placeholder="Usuario"
                onChange={handleInputChange}
                className="p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                className="p-2 border rounded"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Senha"
                  onChange={handleInputChange}
                  className="p-2 w-full border rounded"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

          
              <div className="mt-8">
                <button
                  type="submit"
                  aria-label="Entrar na minha conta"
                  className="w-full py-4 text-sm font-semibold leading-none text-white bg-black border rounded focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none hover:bg-indigo-600"
                >
                 Sign Up  now
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SignupScreen;