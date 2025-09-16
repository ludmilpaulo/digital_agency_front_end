import { Suspense } from "react";
import CareersClient from "./CareersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Careers | Maindo Digital",
  description:
    "Join Maindo Digital and help build Africa’s digital future. Explore open roles and apply online.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <CareersClient />
    </Suspense>
  );
}
