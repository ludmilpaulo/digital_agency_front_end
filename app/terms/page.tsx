import { Suspense } from "react";
import TermsContent from "./TermsContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Terms of Service | Maindo Digital",
  description:
    "The terms and conditions for using Maindo Digital Agency’s website and services.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <TermsContent />
    </Suspense>
  );
}
