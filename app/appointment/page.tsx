"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";
import { baseAPI } from "@/useAPI/api";
import { selectUser } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";

interface FormData {
  user?: number; // Optional, in case there's no logged-in user
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
    user: user?.user_id, // Initially set user_id from the Redux store
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
    if (!user) {
      alert("Please log in to request service'");
      router.push("/LoginScreenUser");
      return;
    }
    try {
      const response = await fetch(`${baseAPI}/appointment/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Appointment booked successfully!');
        router.push("/");
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to submit appointment: ${errorText}`);
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("submitting appointment:");
    }
  };


  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        backgroundImage: `url(${headerData?.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white rounded-lg shadow-md p-8">
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
          <label className="block mb-2">Email:</label>
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
