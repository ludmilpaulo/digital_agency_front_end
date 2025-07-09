"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";
import { baseAPI } from "@/useAPI/api";
import { selectUser } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface FormData {
  user?: number;
  date: string;
  time: string;
  reason: string;
  phone?: string;
  email?: string;
}

const Page = () => {
  const user = useSelector(selectUser);
  const router = useRouter();

  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    date: "",
    time: "",
    reason: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);

  // Input change handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  // Validation helpers
  const isValidEmail = (email?: string) =>
    !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone?: string) =>
    !!phone && /^\+?[\d\s\-()]{7,}$/.test(phone);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.time ||
      !formData.reason ||
      !formData.phone ||
      !formData.email
    ) {
      toast.error(
        <span>
          <FaTimesCircle className="inline mr-2 text-red-500" />
          All fields are required.
        </span>
      );
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error(
        <span>
          <FaTimesCircle className="inline mr-2 text-red-500" />
          Please enter a valid email.
        </span>
      );
      return;
    }
    if (!isValidPhone(formData.phone)) {
      toast.error(
        <span>
          <FaTimesCircle className="inline mr-2 text-red-500" />
          Please enter a valid phone number.
        </span>
      );
      return;
    }

    setLoading(true);
    const appointmentData = { ...formData };
    if (user?.id) appointmentData.user = user.id;

    try {
      const response = await fetch(`${baseAPI}/appointment/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        toast.success(
          <span>
            <FaCheckCircle className="inline mr-2 text-green-500" />
            Appointment booked successfully!
          </span>
        );
        setTimeout(() => router.push("/"), 2000); // Wait, then redirect
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          toast.error(
            <span>
              <FaTimesCircle className="inline mr-2 text-red-500" />
              {errorData.error}
            </span>
          );
        } else {
          const errorMessages = Object.values(errorData).flat().join(" ");
          toast.error(
            <span>
              <FaTimesCircle className="inline mr-2 text-red-500" />
              {errorMessages || "Failed to submit appointment"}
            </span>
          );
        }
      }
    } catch (error) {
      toast.error(
        <span>
          <FaTimesCircle className="inline mr-2 text-red-500" />
          An unexpected error occurred. Please try again.
        </span>
      );
    }
    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-2 py-8 bg-gradient-to-tr from-blue-100 via-white to-blue-200 dark:from-slate-900 dark:to-slate-800 transition-colors"
      style={{
        backgroundImage: headerData?.backgroundImage
          ? `url(${headerData.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        theme="colored"
        closeOnClick
      />
      <form
        className="w-full max-w-lg mx-auto bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 px-8 py-10 animate-fade-in-up"
        style={{
          boxShadow: "0 10px 48px 0 rgba(35,60,120,.15)",
        }}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-800 dark:text-blue-300 tracking-tight drop-shadow-sm">
          Book an Appointment
        </h2>

        {/* Date */}
        <div className="relative mb-6 group">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="peer w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <label className="absolute left-4 top-2 text-gray-400 text-xs transition-all peer-focus:-top-5 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm pointer-events-none">
            Date
          </label>
        </div>
        {/* Time */}
        <div className="relative mb-6 group">
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="peer w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <label className="absolute left-4 top-2 text-gray-400 text-xs transition-all peer-focus:-top-5 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm pointer-events-none">
            Time
          </label>
        </div>
        {/* Reason */}
        <div className="relative mb-6 group">
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="peer w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder=" "
            maxLength={200}
            required
          />
          <label className="absolute left-4 top-2 text-gray-400 text-xs transition-all peer-focus:-top-5 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm pointer-events-none">
            Reason
          </label>
        </div>
        {/* Phone */}
        <div className="relative mb-6 group">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="peer w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder=" "
            maxLength={30}
            required
          />
          <label className="absolute left-4 top-2 text-gray-400 text-xs transition-all peer-focus:-top-5 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm pointer-events-none">
            Phone
          </label>
        </div>
        {/* Email */}
        <div className="relative mb-8 group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="peer w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder=" "
            maxLength={120}
            required
          />
          <label className="absolute left-4 top-2 text-gray-400 text-xs transition-all peer-focus:-top-5 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm pointer-events-none">
            Email
          </label>
        </div>
        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-900 text-white font-semibold text-lg py-3 rounded-xl shadow-md transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            "Book Appointment"
          )}
        </button>
      </form>
      {/* Fade-in animation */}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.75s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
