import { Suspense } from "react";
import AboutPageClient from "./AboutPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "About Us | Maindo Digital Agency",
  description: "Learn more about Maindo Digital Agency and our global journey.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading about page…</div>}>
      <AboutPageClient />
    </Suspense>
  );
}
