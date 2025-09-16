import { Suspense } from "react";
import FAQClient from "./FAQClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "FAQ | Maindo Digital",
  description: "Frequently asked questions about our services, pricing, support, and more.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <FAQClient />
    </Suspense>
  );
}
