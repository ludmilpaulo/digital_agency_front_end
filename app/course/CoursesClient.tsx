"use client";

import React from "react";
import CourseCard from "./CourseCard";

export type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // from /public/images or a remote host you’ve whitelisted
};

// Sample data (unique IDs)
const courses: Course[] = [
  {
    id: "next-intro",
    title: "Introduction to Next.js",
    description: "Learn the basics of Next.js in this comprehensive course.",
    imageUrl: "/images/nextjs-course.jpg",
  },
  {
    id: "next-advanced",
    title: "Advanced Next.js",
    description: "Dive deeper into server rendering and data fetching.",
    imageUrl: "/images/advanced-nextjs.jpg",
  },
  {
    id: "perf-optimization",
    title: "Performance Optimization",
    description: "Make your Next.js apps fast and resilient.",
    imageUrl: "/images/performance.jpg",
  },
];

export default function CoursesClient() {
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
}
