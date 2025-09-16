import { Suspense } from "react";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Projects & Case Studies | Maindo Digital",
  description:
    "Explore recent projects and case studies across web, mobile, e-commerce, automation and more.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <ProjectsClient />
    </Suspense>
  );
}
