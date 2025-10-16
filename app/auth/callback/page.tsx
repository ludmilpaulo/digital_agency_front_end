import { Suspense } from "react";
import CallbackHandler from "./CallbackHandler";

export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}

