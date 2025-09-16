import { Suspense } from "react";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Services | Maindo Digital",
  description: "From idea to execution, we deliver digital growth.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <ServicesClient />
    </Suspense>
  );
}
