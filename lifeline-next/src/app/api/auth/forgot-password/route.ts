import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import { isDemoMode } from "@/lib/db";
import { z } from "zod/v4";

const forgotSchema = z.object({
  email: z.email("Invalid email"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return err(parsed.error.issues[0].message, 422);
    }

    // Demo mode
    if (await isDemoMode()) {
      return ok({
        message: "If an account exists, a password reset email has been sent (demo mode)",
      });
    }

    // In production, we would:
    // 1. Find user by email
    // 2. Generate OTP
    // 3. Send email with OTP
    // For now, return success regardless (security best practice)
    return ok({
      message: "If an account exists, a password reset email has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return serverError();
  }
}
