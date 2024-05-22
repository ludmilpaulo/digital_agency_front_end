"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";
import { baseAPI } from "@/useAPI/api";
import { selectUser } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    user: user?.user_id,
    date: "",
    time: "",
    reason: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${baseAPI}/appointment/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('Appointment booked successfully!');
        alert('Appointment booked successfully!');
        router.push("/");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to submit appointment");
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${headerData?.backgroundImage})`,
      }}
    >
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
        <div>
          <label className="block mb-2">Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        <div>
          <label className="block mb-2">Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        <div>
          <label className="block mb-2">Reason:</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        <div>
          <label className="block mb-2">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        <div>
          <label className="block mb-2">Please type your Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Page;
