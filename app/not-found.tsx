import { Suspense } from "react";
import NotFoundClient from "./not-found/NotFoundClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NotFound() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <NotFoundClient />
    </Suspense>
  );
}
