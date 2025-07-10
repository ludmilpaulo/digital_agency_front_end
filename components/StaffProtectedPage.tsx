"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../redux/store";
import { checkIsStaff } from "../utils/checkIsStaff";

const StaffProtectedPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user not logged in, redirect to login
    if (!user) {
      router.replace("/LoginScreenUser");
      return;
    }
    // Check staff status
    (async () => {
      try {
        const isStaff = await checkIsStaff(user.user_id);
        if (!isStaff) {
          alert("Access denied. Staff only.");
          router.replace("/LoginScreenUser");
        } else {
          setLoading(false);
        }
      } catch (err) {
        alert("Error verifying staff status.");
        router.replace("/LoginScreenUser");
      }
    })();
  }, [user, router]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 bg-white shadow rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Welcome, Staff Member!</h1>
      {/* Protected content goes here */}
      <p className="text-lg">You have access to staff-only resources.</p>
    </div>
  );
};

export default StaffProtectedPage;
