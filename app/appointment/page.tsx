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

    if (!formData.date || !formData.time || !formData.reason || !formData.phone || !formData.email) {
      toast.error("All fields are required");
      return;
    }

    const appointmentData = { ...formData };
    if (user?.id) {
      appointmentData.user = user.id;
    }

    try {
      const response = await fetch(`${baseAPI}/appointment/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        toast.success('Appointment booked successfully!');
        alert('Appointment booked successfully!');
        router.push("/");
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          toast.error(errorData.error);
        } else {
          const errorMessages = Object.values(errorData).flat().join(' ');
          toast.error(errorMessages || "Failed to submit appointment");
        }
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
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Book an Appointment</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="reason">Reason:</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
