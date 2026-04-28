import { ok, serverError } from "@/lib/api";
import { clearAuthCookies } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookies();
    return ok({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return serverError();
  }
}
