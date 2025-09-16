import { Suspense } from "react";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Blog | Maindo Digital",
  description: "Latest posts from Maindo Digital.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading blog…</div>}>
      <BlogClient />
    </Suspense>
  );
}
