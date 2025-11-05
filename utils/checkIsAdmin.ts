// utils/checkIsAdmin.ts
import { baseAPI } from "@/useAPI/api";

export async function checkIsAdmin(userId: number): Promise<{ isAdmin: boolean; detail?: string }> {
  try {
    const res = await fetch(`${baseAPI}/account/check-admin/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { isAdmin: false, detail: data.detail || "Network error" };
    }

    return { isAdmin: !!data.is_admin };
  } catch (error) {
    return { isAdmin: false, detail: "Network error" };
  }
}

