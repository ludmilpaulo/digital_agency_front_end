"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

interface Solution {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
}

const Solutions: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const { data } = await axios.get<Solution[]>(
          "http://localhost:8000/api/solutions/",
        );
        setSolutions(data);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
      setLoading(false);
    };

    fetchSolutions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution) => (
          <div
            key={solution.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative w-full h-60">
              <Image
                src={solution.image}
                alt={solution.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold">{solution.name}</h3>
              <p className="text-sm text-gray-500">{solution.category}</p>
              <div
                dangerouslySetInnerHTML={{ __html: solution.description }}
                className="mt-2 text-gray-700"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Solutions;
