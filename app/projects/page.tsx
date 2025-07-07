"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaSearch, FaAward, FaFilter } from "react-icons/fa";
import { AboutUsData } from "@/useAPI/types";
import { fetchAboutUsData } from "@/useAPI/information";
import { baseAPI } from "@/useAPI/api";
import { MOCK_PROJECTS } from "@/mocks/projects";


interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  category?: string; // Add if you want category filtering
  badge?: string;
}

const CATEGORIES = [
  "All",
  "Web",
  "Mobile",
  "E-commerce",
  "Branding",
  "Automation",
  "SaaS",
];

const BADGE_MAP: Record<string, { icon: JSX.Element; text: string }> = {
  featured: { icon: <FaAward className="text-yellow-400 mr-1" />, text: "Featured" },
};

function truncateText(html: string, max: number) {
  if (!html) return "";
  // Remove HTML tags (SSR safe)
  const str = html.replace(/<[^>]*>/g, "");
  return str.length > max ? str.substring(0, max) + "..." : str;
}


const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetchAboutUsData().then(setHeaderData);
  }, []);

  useEffect(() => {
  fetch(`${baseAPI}/project/projects/`)
    .then(res => res.json())
    .then((data) => setProjects(data)); // <--- FIXED!
}, []);


  // Filtering and searching
  const filteredProjects = useMemo(() => {
    let list = [...projects];
    if (filter !== "All") {
      list = list.filter(p => p.category === filter);
    }
    if (search) {
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [projects, filter, search]);

  return (
    <div
      className="min-h-screen py-24 px-4"
      style={{
        backgroundImage: headerData?.backgroundImage
          ? `linear-gradient(135deg, rgba(18,18,40,0.90), rgba(18,20,46,0.97)), url(${headerData.backgroundImage})`
          : "linear-gradient(135deg, #171f34, #293350)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Our Projects & Case Studies
        </motion.h1>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full font-bold transition 
                  ${filter === cat ? "bg-blue-500 text-white" : "bg-white text-blue-800 hover:bg-blue-100"}
                `}
                onClick={() => setFilter(cat)}
              >
                <FaFilter className="inline mr-1 text-xs" />
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow">
            <FaSearch className="text-blue-400 mr-2" />
            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-none focus:ring-0 outline-none bg-transparent text-gray-700"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.09,
              },
            },
          }}
        >
          {filteredProjects.length === 0 && (
            <div className="text-center col-span-full py-24 text-white/80 text-xl">
              No projects found. Try a different filter.
            </div>
          )}

          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group relative"
              whileHover={{ y: -7, scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                href={{
                  pathname: "/projectDetails",
                  query: {
                    title: project.title,
                    image: project.image,
                    description: project.description,
                    link: project.link,
                  },
                }}
                className="block"
              >
                <div className="relative w-full h-52 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-all"
                  />
                  {project.badge && BADGE_MAP[project.badge] && (
                    <span className="absolute top-4 left-4 flex items-center bg-yellow-100 text-yellow-900 font-bold px-3 py-1 rounded-full shadow">
                      {BADGE_MAP[project.badge].icon}
                      {BADGE_MAP[project.badge].text}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <h3 className="text-blue-800 text-xl font-extrabold">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {truncateText(project.description, 110)}
                  </p>
                  <button className="mt-2 w-full bg-blue-600 hover:bg-blue-800 text-white rounded-lg font-bold py-2 transition-all">
                    View Details
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Add a call to action or highlight */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 hover:from-yellow-400 hover:to-yellow-600 text-white text-lg font-bold px-8 py-4 rounded-full shadow-xl transition-all"
          >
            Have a Project in Mind? Let’s Build it Together!
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;
