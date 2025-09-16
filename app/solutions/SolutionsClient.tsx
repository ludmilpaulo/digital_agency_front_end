"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { baseAPI } from "@/useAPI/api";

interface Solution {
  id: number;
  name: string;
  description: string; // HTML
  image: string;       // full URL
  category: string;
}

export default function SolutionsClient() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // If your API base already ends with /api, keep just `/solutions/` here.
        const res = await fetch(`${baseAPI}/solutions/`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch solutions (${res.status})`);
        const data: Solution[] = await res.json();
        if (mounted) setSolutions(data);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Error fetching solutions");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-60 bg-gray-200" />
              <div className="p-5 space-y-2">
                <div className="h-5 bg-gray-200 w-2/3 rounded" />
                <div className="h-4 bg-gray-200 w-1/3 rounded" />
                <div className="h-4 bg-gray-200 w-full rounded" />
                <div className="h-4 bg-gray-200 w-5/6 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {err}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution) => (
          <article key={solution.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full h-60">
              <Image
                src={solution.image}
                alt={solution.name}
                fill
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 50vw,
                       33vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-blue-900">{solution.name}</h3>
              <p className="text-sm text-gray-500">{solution.category}</p>
              <div
                className="mt-2 text-gray-700 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: solution.description }}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
