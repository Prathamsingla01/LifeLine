import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// GET /api/fundraisers
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    // Try FastAPI backend first
    try {
      const backendRes = await fetch(`${FASTAPI_URL}/fundraisers`, {
        headers: { "Content-Type": "application/json" },
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.length > 0) {
          const mapped = data.map((f: { id: string; title: string; description: string | null; goal_amount: number; raised_amount: number; verified: boolean; created_at: string }) => ({
            id: f.id,
            title: f.title,
            description: f.description || "",
            goalAmount: f.goal_amount,
            raised: f.raised_amount,
            currency: "INR",
            category: "disaster_relief",
            image: null,
            status: "ACTIVE",
            verified: f.verified,
            creatorName: "LifeLine Community",
            donorCount: Math.floor(Math.random() * 500),
            createdAt: f.created_at,
          }));
          return ok(mapped);
        }
      }
    } catch {
      console.log("[Fundraisers] FastAPI backend not reachable, using demo data");
    }

    // Demo fallback
    return ok([
      {
        id: "fr1",
        title: "Flood Relief — Assam 2025",
        description: "Supporting families displaced by the devastating floods in Assam. Funds will provide food, shelter, and medical supplies.",
        goalAmount: 500000,
        raised: 342000,
        currency: "INR",
        category: "disaster_relief",
        image: null,
        status: "ACTIVE",
        verified: true,
        creatorName: "LifeLine Foundation",
        donorCount: 248,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        id: "fr2",
        title: "Burns Treatment — Rohit Kumar",
        description: "12-year-old Rohit suffered severe burns in a house fire. Help fund his treatment and recovery.",
        goalAmount: 200000,
        raised: 156000,
        currency: "INR",
        category: "medical",
        image: null,
        status: "ACTIVE",
        verified: true,
        creatorName: "Dr. Priya Sharma",
        donorCount: 124,
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        id: "fr3",
        title: "Earthquake Relief — Nepal Border",
        description: "Emergency aid for communities affected by the earthquake near the India-Nepal border.",
        goalAmount: 1000000,
        raised: 720000,
        currency: "INR",
        category: "disaster_relief",
        image: null,
        status: "ACTIVE",
        verified: true,
        creatorName: "Red Cross India",
        donorCount: 512,
        createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
      },
    ]);
  } catch (error) {
    console.error("Get fundraisers error:", error);
    return serverError();
  }
}
