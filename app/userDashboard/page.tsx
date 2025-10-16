import { Suspense } from "react";
import UserDashboardClient from "./UserDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Dashboard | Maindo Digital",
  description: "Track your projects, services, and profile",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard…</div>}>
      <UserDashboardClient />
    </Suspense>
  );
}
