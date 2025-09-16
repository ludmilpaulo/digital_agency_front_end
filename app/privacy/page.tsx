import { Suspense } from "react";
import PrivacyContent from "./PrivacyContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Privacy Policy | Maindo Digital",
  description:
    "Learn how Maindo Digital Agency collects, uses, and protects your information.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <PrivacyContent />
    </Suspense>
  );
}
