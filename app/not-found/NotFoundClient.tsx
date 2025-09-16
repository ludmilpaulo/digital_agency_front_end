"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NotFoundClient() {
  const params = useSearchParams(); // ✅ now under Suspense
  const from = params.get("from") ?? "/";

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-6">
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="text-slate-600 max-w-prose">
        We couldn’t find what you were looking for.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="px-4 py-2 rounded bg-blue-600 text-white">Go Home</Link>
        <Link href={from} className="px-4 py-2 rounded border">Go Back</Link>
      </div>
    </main>
  );
}
