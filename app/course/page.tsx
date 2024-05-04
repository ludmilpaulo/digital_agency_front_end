"use client";
import React from "react";
import CourseCard from "./CourseCard";

// Sample data, ideally this would come from an API
const courses = [
  {
    id: 1,
    title: "Introduction to Next.js",
    description: "Learn the basics of Next.js in this comprehensive course.",
    imageUrl: "/images/nextjs-course.jpg",
  },
  {
    id: 2,
    title: "Advanced Next.js",
    description:
      "Dive deeper into server-side rendering and static site generation.",
    imageUrl: "/images/advanced-nextjs.jpg",
  },
  {
    id: 1,
    title: "Introduction to Next.js",
    description: "Learn the basics of Next.js in this comprehensive course.",
    imageUrl: "/images/nextjs-course.jpg",
  },
  {
    id: 2,
    title: "Advanced Next.js",
    description:
      "Dive deeper into server-side rendering and static site generation.",
    imageUrl: "/images/advanced-nextjs.jpg",
  },
  {
    id: 1,
    title: "Introduction to Next.js",
    description: "Learn the basics of Next.js in this comprehensive course.",
    imageUrl: "/images/nextjs-course.jpg",
  },
  {
    id: 2,
    title: "Advanced Next.js",
    description:
      "Dive deeper into server-side rendering and static site generation.",
    imageUrl: "/images/advanced-nextjs.jpg",
  },
  // Add more courses as needed
];

const CoursesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
