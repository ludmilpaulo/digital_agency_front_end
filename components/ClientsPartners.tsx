import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

interface Entity {
  id: number;
  name: string;
  description: string;
  logo: string;
}

const ClientsPartners: React.FC = () => {
  const [clients, setClients] = useState<Entity[]>([]);
  const [partners, setPartners] = useState<Entity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const clientsRes = await axios.get<Entity[]>(
          "http://localhost:8000/api/clients/",
        );
        const partnersRes = await axios.get<Entity[]>(
          "http://localhost:8000/api/partners/",
        );
        setClients(clientsRes.data);
        setPartners(partnersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchEntities();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-6">
        Our Clients and Partners
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...clients, ...partners].map((entity) => (
          <div
            key={entity.id}
            className="bg-white rounded-lg shadow-lg p-5 text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={entity.logo}
                alt={entity.name}
                layout="fill"
                objectFit="contain"
                className="rounded-full"
              />
            </div>
            <h5 className="text-lg font-bold">{entity.name}</h5>
            <p className="text-sm text-gray-500">{entity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPartners;
