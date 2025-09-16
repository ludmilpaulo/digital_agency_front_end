import { Suspense } from "react";
import AppointmentClient from "./AppointmentClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Book an Appointment | Maindo Digital",
  description: "Schedule a consultation with Maindo Digital.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading appointment…</div>}>
      <AppointmentClient />
    </Suspense>
  );
}
