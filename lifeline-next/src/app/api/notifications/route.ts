import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// GET /api/notifications — from database
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    // Try FastAPI backend
    try {
      const loginRes = await fetch(`${FASTAPI_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: "password123" }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        const res = await fetch(`${FASTAPI_URL}/notifications`, {
          headers: { Authorization: `Bearer ${loginData.access_token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            return ok(data.data);
          }
        }
      }
    } catch {
      console.log("[Notifications] FastAPI not reachable, using demo data");
    }

    // Demo fallback
    return ok([
      { id: "n1", type: "EMERGENCY", title: "Flood Alert — Delhi NCR", message: "Moderate flood risk in Yamuna basin areas.", icon: "W", severity: "CRITICAL", read: false, createdAt: new Date(Date.now() - 300000).toISOString() },
      { id: "n2", type: "FAMILY", title: "Ananya arrived at school", message: "Geofence entered: DPS School, Sector 45", icon: "V", severity: "LOW", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: "n3", type: "SYSTEM", title: "Medical profile updated", message: "Your medical profile was synced successfully.", icon: "M", severity: "LOW", read: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
    ]);
  } catch (error) {
    console.error("Get notifications error:", error);
    return serverError();
  }
}
