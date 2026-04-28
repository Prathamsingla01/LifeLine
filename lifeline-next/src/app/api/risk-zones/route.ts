import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/db";

// GET /api/risk-zones
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    if (await isDemoMode()) {
      return ok([
        { id: "rz1", name: "Yamuna Flood Zone", description: "Historical flooding area along Yamuna river", lat: 28.6800, lng: 77.2500, radiusM: 2000, riskLevel: "CRITICAL", type: "flood" },
        { id: "rz2", name: "CP Traffic Hotspot", description: "High accident density area — Connaught Place", lat: 28.6315, lng: 77.2167, radiusM: 800, riskLevel: "MODERATE", type: "accident" },
        { id: "rz3", name: "Rohini Industrial Fire Zone", description: "Industrial area with fire risk", lat: 28.7200, lng: 77.1100, radiusM: 1200, riskLevel: "MODERATE", type: "fire" },
        { id: "rz4", name: "Saket Waterlogging", description: "Seasonal waterlogging during monsoon", lat: 28.5245, lng: 77.2066, radiusM: 600, riskLevel: "LOW", type: "flood" },
        { id: "rz5", name: "Karol Bagh Market Fire Risk", description: "Dense market area with electrical fire risk", lat: 28.6519, lng: 77.1909, radiusM: 500, riskLevel: "CRITICAL", type: "fire" },
      ]);
    }

    return ok([]);
  } catch (error) {
    console.error("Get risk zones error:", error);
    return serverError();
  }
}
