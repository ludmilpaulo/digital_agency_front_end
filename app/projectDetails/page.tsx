import { Suspense } from "react";
import ProjectDetailsClient from "./ProjectDetailsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Project Details | Maindo Digital",
  description: "Case studies and details for Maindo Digital projects.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <ProjectDetailsClient />
    </Suspense>
  );
}
