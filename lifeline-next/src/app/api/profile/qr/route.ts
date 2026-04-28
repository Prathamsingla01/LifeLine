import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser, DEMO_USER } from "@/lib/auth";
import { isDemoMode } from "@/lib/db";

// GET /api/profile/qr — get QR data for emergency card
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    if (await isDemoMode()) {
      return ok({
        lifelineId: DEMO_USER.lifelineId,
        name: DEMO_USER.name,
        bloodType: "O+",
        allergies: ["Penicillin"],
        emergencyContacts: [
          { name: "Priya Mehta", phone: "+91 98765 43211", relation: "Spouse" },
        ],
        qrUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/profile/public/${DEMO_USER.lifelineId}`,
      });
    }

    return ok({
      lifelineId: user.userId,
      qrUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/profile/public/${user.userId}`,
    });
  } catch (error) {
    console.error("Get QR data error:", error);
    return serverError();
  }
}
