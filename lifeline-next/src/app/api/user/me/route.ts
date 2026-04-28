import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser, DEMO_USER } from "@/lib/auth";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export async function GET() {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return unauthorized();

    // Try FastAPI backend — reads from real database
    try {
      // We need to get the user's backend token — login first to get a token
      const loginRes = await fetch(`${FASTAPI_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tokenPayload.email, password: "password123" }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        const backendToken = loginData.access_token;

        const meRes = await fetch(`${FASTAPI_URL}/me`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        });

        if (meRes.ok) {
          const data = await meRes.json();
          if (data.success && data.data) {
            return ok(data.data);
          }
        }
      }
    } catch {
      console.log("[User/Me] FastAPI not reachable, using demo data");
    }

    // Demo fallback
    return ok({
      user: {
        ...DEMO_USER,
        email: tokenPayload.email,
        role: tokenPayload.role,
      },
      profile: {
        bloodType: "O+",
        allergies: ["Penicillin"],
        conditions: ["Asthma (mild)"],
        medications: ["Inhaler (PRN)"],
        emergencyNotes: "Carry inhaler at all times",
        organDonor: true,
        insuranceProvider: "Star Health",
        insurancePolicyNo: "SH-2025-482901",
        primaryDoctor: "Dr. Sharma",
        primaryDoctorPhone: "+91 98765 43210",
        height: 175,
        weight: 72,
      },
      settings: {
        theme: "dark", language: "en",
        pushNotifications: true, emailNotifications: true,
        smsAlerts: true, locationSharing: true,
        crashDetection: true, crashSensitivity: "medium",
        autoSOS: false, sosCountdown: 10, silentMode: false,
      },
      safetyScore: { score: 82, level: 4, streak: 12 },
      badges: [
        { badge: "first_responder", awardedAt: "2025-01-15" },
        { badge: "safety_star", awardedAt: "2025-02-01" },
        { badge: "community_hero", awardedAt: "2025-03-10" },
      ],
      emergencyContacts: [
        { id: "ec1", name: "Priya Mehta", phone: "+91 98765 43211", relation: "Spouse", priority: 1 },
        { id: "ec2", name: "Raj Mehta", phone: "+91 98765 43212", relation: "Father", priority: 2 },
      ],
    });
  } catch (error) {
    console.error("Get user error:", error);
    return serverError();
  }
}
