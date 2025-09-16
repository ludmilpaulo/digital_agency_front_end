import { Suspense } from "react";
import HaveAProjectClient from "./HaveAProjectClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Have a Project | Maindo Digital",
  description: "Tell us about your project and get a fast quote.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <HaveAProjectClient />
    </Suspense>
  );
}
