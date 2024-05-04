"use client";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { baseAPI } from "@/useAPI/api";
import { fetchAboutUsData } from "@/useAPI/information";
import { AboutUsData } from "@/useAPI/types";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

const Home: NextPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      setHeaderData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch(`${baseAPI}/project/projects/`);
      const data = await response.json();
      setProjects(data);
    }

    fetchProjects();
  }, []);

  return (
    <div
      className="mx-auto px-8 pt-56"
      style={{
        backgroundImage: `url(${headerData?.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
