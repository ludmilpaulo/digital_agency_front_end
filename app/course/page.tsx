import { Suspense } from "react";
import CoursesClient from "./CoursesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Courses | Maindo Digital",
  description: "Browse our courses.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading courses…</div>}>
      <CoursesClient />
    </Suspense>
  );
}
