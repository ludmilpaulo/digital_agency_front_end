import { Suspense } from "react";
import BoardsPage from "./BoardsPage";

// If you're exporting static HTML or just want to avoid prerendering here:
export const dynamic = "force-dynamic"; // <- remove if you actually want SSG

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard…</div>}>
      <BoardsPage />
    </Suspense>
  );
}
