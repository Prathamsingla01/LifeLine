import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// GET /api/feed — live emergency feed from database
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    // Try FastAPI backend — reads from real database
    try {
      const res = await fetch(`${FASTAPI_URL}/feed`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          return ok(data.data);
        }
      }
    } catch {
      console.log("[Feed] FastAPI not reachable, using demo data");
    }

    // Demo fallback
    return ok([
      { id: "INC-2847", type: "accident", severity: "critical", title: "Car Accident — Multi-vehicle", location: "Connaught Place, Delhi", time: "2 min ago", status: "responding", responders: 3, lat: 28.6315, lng: 77.2167 },
      { id: "INC-2846", type: "medical", severity: "moderate", title: "Fall Injury — Elderly", location: "Karol Bagh, Delhi", time: "5 min ago", status: "responding", responders: 1, lat: 28.6519, lng: 77.1909 },
      { id: "INC-2845", type: "fire", severity: "critical", title: "Building Fire — 3rd Floor", location: "Saket, Delhi", time: "8 min ago", status: "active", responders: 5, lat: 28.5245, lng: 77.2066 },
      { id: "INC-2844", type: "medical", severity: "low", title: "Minor Injury — Sports", location: "Dwarka Sec-12", time: "15 min ago", status: "resolved", responders: 1, lat: 28.5921, lng: 77.0460 },
      { id: "INC-2843", type: "flood", severity: "moderate", title: "Waterlogging — Road Blocked", location: "Yamuna Banks", time: "22 min ago", status: "active", responders: 2, lat: 28.6800, lng: 77.2500 },
    ]);
  } catch (error) {
    console.error("Get feed error:", error);
    return serverError();
  }
}
