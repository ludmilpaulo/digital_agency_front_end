"use client";

import Image from "next/image";
import React from "react";
import type { Course } from "./CoursesClient";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="border rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="relative w-full h-44">
        <Image
          src={course.imageUrl}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{course.title}</h2>
        <p className="text-sm text-slate-600 mt-1">{course.description}</p>
      </div>
    </article>
  );
}
