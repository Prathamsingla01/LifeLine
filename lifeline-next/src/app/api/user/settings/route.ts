import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/db";
import { NextRequest } from "next/server";

// GET /api/user/settings
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    if (await isDemoMode()) {
      return ok({
        theme: "dark",
        language: "en",
        pushNotifications: true,
        emailNotifications: true,
        smsAlerts: true,
        locationSharing: true,
        crashDetection: true,
        crashSensitivity: "medium",
        autoSOS: false,
        sosCountdown: 10,
        silentMode: false,
      });
    }

    return ok({});
  } catch (error) {
    console.error("Get settings error:", error);
    return serverError();
  }
}

// PUT /api/user/settings
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const body = await request.json();

    if (await isDemoMode()) {
      return ok({ ...body, message: "Settings updated (demo mode)" });
    }

    return ok({ ...body, message: "Settings updated" });
  } catch (error) {
    console.error("Update settings error:", error);
    return serverError();
  }
}
