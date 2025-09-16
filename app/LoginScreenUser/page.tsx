import { Suspense } from "react";
import LoginScreenUserClient from "./LoginScreenUserClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Login | Maindo Digital",
  description: "Sign in to Maindo Digital.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading login…</div>}>
      <LoginScreenUserClient />
    </Suspense>
  );
}
