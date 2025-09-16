import { Suspense } from "react";
import AdminPage from "./AdminPage";

// Ensure this route is rendered dynamically (avoids SSG/Export errors)
export const dynamic = "force-dynamic";
// If you rely on request headers/cookies, you can also add:
// export const fetchCache = "force-no-store";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading admin…</div>}>
      <AdminPage />
    </Suspense>
  );
}
