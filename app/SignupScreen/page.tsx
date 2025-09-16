import { Suspense } from "react";
import SignupScreenClient from "./SignupScreenClient";

// Make this route dynamic (prevents SSG/export prerender issues)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading sign-up…</div>}>
      <SignupScreenClient />
    </Suspense>
  );
}
