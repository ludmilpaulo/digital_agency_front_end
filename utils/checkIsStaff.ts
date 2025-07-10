import { baseAPI } from "@/useAPI/api";

// utils/checkIsStaff.ts
export async function checkIsStaff(userId: number) {
  const res = await fetch(`${baseAPI}/account/check-staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error("Network error");
  const data = await res.json();
  return data.is_staff; // Should be a boolean
}
