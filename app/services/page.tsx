"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation"; // corrected import
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";
import { selectUser } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";
import { baseAPI } from "@/useAPI/api";
import { Transition } from "@headlessui/react";

type Service = {
  id: number;
  title: string;
  image: string;
  rating: number;
  description: string;
};

type ServiceRequest = {
  serviceId: number | undefined;
  userId: number | undefined;
  message: string;
  phone: string;
  address: string;
  email: string;
};

export default function Services() {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [request, setRequest] = useState<ServiceRequest>({
    serviceId: undefined,
    userId: user?.user_id,
    message: "",
    phone: "",
    address: "",
    email: "",
  });
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    axios
      .get(`${baseAPI}/service/services/`)
      .then((response) => setServices(response.data))
      .catch((error) => console.error("Error fetching services", error));
  }, []);

  useEffect(() => {
    setRequest((prev) => ({
      ...prev,
      service: selectedService?.id, // Ensure property name is 'service'
      user: user?.user_id,          // Ensure property name is 'user'
    }));
}, [selectedService, user]);

const handleSubmit = async (event: React.FormEvent) => {
    console.log("service request", request)
    event.preventDefault();

    if (!user) {
      alert("Please log in to request service'");
      router.push("/LoginScreenUser");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${baseAPI}/service/service-requests/`, request);
      alert("Request submitted successfully! We will be in touch.");
      setRequest({
        serviceId: undefined,
        userId: user?.user_id,
        message: "",
        phone: "",
        address: "",
        email: "",
      }); // Clear the form fields
      setLoading(false);
      router.push('/'); // Redirect to the home page or dashboard as required
    } catch (error) {
      console.error("Error submitting request", error);
      setLoading(false);
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: rating }, (_, i) => (
      <svg
        key={i}
        className="w-5 h-5 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.813l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.573-.38-1.813.588-1.813h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    ));

  return (
    <div className="flex flex-wrap justify-center pt-56" style={{
      backgroundImage: `url(${headerData?.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
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
      {services.map((service) => (
        <div
          key={service.id}
          className="card bg-white shadow-lg rounded-lg m-4 p-4 w-96"
        >
          <h3 className="text-lg font-bold">{service.title}</h3>
          {service.image && (
            <div className="relative w-full h-48">
              <Image
                src={service.image}
                alt={service.title}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>
          )}
          <p dangerouslySetInnerHTML={{ __html: service.description }} />
          <div className="flex items-center justify-between mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => setSelectedService(service)}
            >
              Request Service
            </button>
            <span className="flex items-center">
              {renderStars(service.rating)}
            </span>
          </div>
        </div>
      ))}
      {selectedService && (
        <form
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
          onSubmit={handleSubmit}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              Request {selectedService.title}
            </h2>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Message:
              <textarea
                value={request.message}
                onChange={(e) =>
                  setRequest({ ...request, message: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your message"
              />
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone:
              <input
                type="text"
                value={request.phone}
                onChange={(e) =>
                  setRequest({ ...request, phone: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your phone number"
              />
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address:
              <input
                type="text"
                value={request.address}
                onChange={(e) =>
                  setRequest({ ...request, address: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your address"
              />
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
              <input
                type="email"
                value={request.email}
                onChange={(e) =>
                  setRequest({ ...request, email: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="mt-4 ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
