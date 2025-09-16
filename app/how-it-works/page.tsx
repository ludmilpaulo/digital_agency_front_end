import { Suspense } from "react";
import HowItWorksClient from "./HowItWorksClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "How It Works | Maindo Digital",
  description: "Our simple step-by-step process.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <HowItWorksClient />
    </Suspense>
  );
}
