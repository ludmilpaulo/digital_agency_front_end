import { Suspense } from "react";
import TestimonialClient from "./TestimonialClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <TestimonialClient />
    </Suspense>
  );
}
