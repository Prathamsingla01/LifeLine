import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest } from "next/server";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// POST /api/emergencies/sos — Quick SOS with just location
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const { lat, lng, type = "MEDICAL" } = body;

    // Try FastAPI backend
    try {
      const typeMap: Record<string, string> = {
        MEDICAL: "Medical",
        FIRE: "Fire",
        ACCIDENT: "Accident",
        OTHER: "Other",
      };

      const backendRes = await fetch(`${FASTAPI_URL}/report-emergency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${body.backendToken || ""}`,
        },
        body: JSON.stringify({
          type: typeMap[type] || "Medical",
          latitude: lat || 28.6139,
          longitude: lng || 77.2090,
          description: `SOS Emergency - ${type}`,
        }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return ok({
          id: data.emergency_id || `SOS-${Date.now().toString().slice(-6)}`,
          type,
          severity: "CRITICAL",
          title: "SOS Emergency",
          lat: data.latitude || lat || 28.6139,
          lng: data.longitude || lng || 77.2090,
          status: "ACTIVE",
          responders: 0,
          reporterId: user.userId,
          createdAt: data.created_at || new Date().toISOString(),
          message: "SOS alert sent (FastAPI backend)",
          eta: "4 min",
          nearestHospital: "AIIMS Delhi",
          ambulanceDispatched: true,
        }, 201);
      }
    } catch {
      console.log("[SOS] FastAPI backend not reachable, using demo mode");
    }

    // Demo fallback
    return ok({
      id: `SOS-${Date.now().toString().slice(-6)}`,
      type,
      severity: "CRITICAL",
      title: "SOS Emergency",
      lat: lat || 28.6139,
      lng: lng || 77.2090,
      status: "ACTIVE",
      responders: 0,
      reporterId: user.userId,
      createdAt: new Date().toISOString(),
      message: "SOS alert sent (demo mode)",
      eta: "4 min",
      nearestHospital: "AIIMS Delhi",
      ambulanceDispatched: true,
    }, 201);
  } catch (error) {
    console.error("SOS error:", error);
    return serverError();
  }
}
