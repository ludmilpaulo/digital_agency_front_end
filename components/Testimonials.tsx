"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  testimonial: string;
  image: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get<Testimonial[]>(
          "http://localhost:8000/api/testimonials/",
        );
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg shadow-lg p-5 text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <h5 className="text-lg font-bold">{testimonial.name}</h5>
            <p className="text-sm text-gray-500">{testimonial.designation}</p>
            <p className="text-gray-700 mt-4">{testimonial.testimonial}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
