import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/db";

// POST /api/notifications/read-all
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    if (await isDemoMode()) {
      return ok({ message: "All notifications marked as read (demo mode)" });
    }

    return ok({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all read error:", error);
    return serverError();
  }
}
