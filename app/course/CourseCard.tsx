"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <div className="border p-4 shadow-md rounded-lg">
      {/* Replacing <img> with Next.js Image component */}
      <Image
        src={course.imageUrl}
        alt={course.title}
        width={400}
        height={160}
        className="rounded"
        layout="responsive"
      />
      <h3 className="text-lg font-bold my-2">{course.title}</h3>
      <p className="text-sm text-gray-600">{course.description}</p>
      {/* Replacing <a> with <span> that's clickable */}
      <span
        onClick={handleClick}
        className="text-blue-500 hover:text-blue-700 cursor-pointer"
      >
        Learn more
      </span>
    </div>
  );
};

export default CourseCard;
