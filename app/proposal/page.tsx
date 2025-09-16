import { Suspense } from "react";
import ProposalClient from "./ProposalClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Request a Proposal | Maindo Digital",
  description:
    "Tell us about your project and get a fast proposal from Maindo Digital.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <ProposalClient />
    </Suspense>
  );
}
