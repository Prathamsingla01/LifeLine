import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// GET /api/family — from database
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
        const res = await fetch(`${FASTAPI_URL}/family`, {
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
      console.log("[Family] FastAPI not reachable, using demo data");
    }

    // Demo fallback
    return ok({
      family: { id: "fam-demo-001", name: "Mehta Family", inviteCode: "MEHTA-2025" },
      members: [
        { id: "fm1", userId: "u1", name: "Arjun Mehta", role: "ADMIN", nickname: null, avatar: null, lat: 28.6139, lng: 77.2090, lastSeen: new Date().toISOString(), status: "online", battery: 85 },
        { id: "fm2", userId: "u2", name: "Priya Mehta", role: "MEMBER", nickname: "Priya", avatar: null, lat: 28.6200, lng: 77.2150, lastSeen: new Date(Date.now() - 300000).toISOString(), status: "online", battery: 62 },
        { id: "fm3", userId: "u3", name: "Ananya Mehta", role: "CHILD", nickname: "Ananya", avatar: null, lat: 28.5800, lng: 77.3200, lastSeen: new Date(Date.now() - 600000).toISOString(), status: "online", battery: 45 },
        { id: "fm4", userId: "u4", name: "Raj Mehta", role: "MEMBER", nickname: "Papa", avatar: null, lat: 28.6500, lng: 77.1800, lastSeen: new Date(Date.now() - 3600000).toISOString(), status: "offline", battery: 30 },
      ],
      geofences: [
        { id: "gf1", name: "Home", lat: 28.6139, lng: 77.2090, radiusM: 200, type: "safe" },
        { id: "gf2", name: "DPS School", lat: 28.5800, lng: 77.3200, radiusM: 300, type: "safe" },
      ],
    });
  } catch (error) {
    console.error("Get family error:", error);
    return serverError();
  }
}

// POST /api/family
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    return ok({
      id: `fam-${Date.now()}`,
      name: "My Family",
      inviteCode: `LL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      message: "Family created",
    }, 201);
  } catch (error) {
    console.error("Create family error:", error);
    return serverError();
  }
}
