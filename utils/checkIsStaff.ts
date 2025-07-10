// utils/checkIsStaff.ts
import { baseAPI } from "@/useAPI/api";

export async function checkIsStaff(userId: number): Promise<{ isStaff: boolean; detail?: string }> {
  try {
    const res = await fetch(`${baseAPI}/account/check-staff/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Return detail from backend if available
      return { isStaff: false, detail: data.detail || "Network error" };
    }

    return { isStaff: !!data.is_staff };
  } catch (error) {
    return { isStaff: false, detail: "Network error" };
  }
}
