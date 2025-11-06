// utils/checkIsAdmin.ts
import { baseAPI } from "@/useAPI/api";

export async function checkIsAdmin(userId: number): Promise<{ isAdmin: boolean; detail?: string }> {
  try {
    console.log("Checking admin status for user:", userId);
    
    const res = await fetch(`${baseAPI}/account/check-admin/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await res.json();
    console.log("Admin check response:", { status: res.status, data });

    if (!res.ok) {
      const errorDetail = data.detail || "Unable to verify admin status";
      console.warn("Admin check failed:", errorDetail);
      return { isAdmin: false, detail: errorDetail };
    }

    const isAdmin = !!data.is_admin;
    console.log("User admin status:", isAdmin);
    return { isAdmin };
  } catch (error) {
    console.error("Admin check error:", error);
    return { 
      isAdmin: false, 
      detail: "Network error: Unable to verify admin status" 
    };
  }
}

