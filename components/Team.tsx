import React, { useEffect, useState } from "react";
import Image from "next/image";
import { baseAPI } from "@/useAPI/api";

interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string; // URL to the image
  github?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${baseAPI}/info/teams/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (error: any) {
        setError(error.message || "Failed to fetch team members");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const renderTeamMember = (member: TeamMember | undefined) => {
    if (!member) return null;
    return (
      <div key={member.id} className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <Image
            src={member.image}
            alt={member.name}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="mt-2">
          <h5 className="text-lg font-bold">{member.name}</h5>
          <p className="text-sm">{member.title}</p>
        </div>
      </div>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (teamMembers.length === 0) return <div>No team members found.</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center">
        {renderTeamMember(
          teamMembers.find((member) => member.title === "CEO/Founder"),
        )}
      </div>
      <div className="flex justify-around my-8">
        {teamMembers
          .filter((member) => member.title.match(/Manager$|Advisor$/))
          .map(renderTeamMember)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        {teamMembers
          .filter((member) => member.title.match(/Specialist$|Developer$/))
          .map(renderTeamMember)}
      </div>
      <div className="flex justify-center my-8">
        {renderTeamMember(
          teamMembers.find((member) => member.title === "Content Creator"),
        )}
      </div>
    </div>
  );
};

export default Team;
