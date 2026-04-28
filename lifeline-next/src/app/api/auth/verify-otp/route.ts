import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import { prisma, isDemoMode } from "@/lib/db";
import { z } from "zod/v4";

const verifySchema = z.object({
  code: z.string().length(6, "OTP must be 6 digits"),
  type: z.enum(["EMAIL_VERIFY", "PHONE_VERIFY", "PASSWORD_RESET"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return err(parsed.error.issues[0].message, 422);
    }

    // Demo mode — always accept
    if (await isDemoMode()) {
      return ok({ message: "OTP verified (demo mode)", verified: true });
    }

    const { code, type } = parsed.data;

    const otp = await prisma.oTP.findFirst({
      where: {
        code,
        type,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!otp) {
      return err("Invalid or expired OTP", 400);
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // If email verification, mark user as verified
    if (type === "EMAIL_VERIFY") {
      await prisma.user.update({
        where: { id: otp.userId },
        data: { isVerified: true },
      });
    }

    return ok({ message: "OTP verified successfully", verified: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return serverError();
  }
}
