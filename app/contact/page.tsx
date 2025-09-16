import { Suspense } from "react";
import ContactClient from "./ContactClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Contact | Maindo Digital",
  description: "Get in touch with Maindo Digital.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading contact…</div>}>
      <ContactClient />
    </Suspense>
  );
}
