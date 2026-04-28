import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import { prisma, isDemoMode } from "@/lib/db";
import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  DEMO_USER,
} from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const oldRefreshToken = cookieStore.get("ll-refresh-token")?.value;

    if (!oldRefreshToken) {
      return err("No refresh token", 401);
    }

    // Demo mode
    if (await isDemoMode()) {
      const payload = await verifyRefreshToken(oldRefreshToken);
      if (!payload) return err("Invalid refresh token", 401);

      const accessToken = await createAccessToken({
        userId: DEMO_USER.id,
        email: payload.email,
        role: payload.role,
      });
      const refreshToken = await createRefreshToken({
        userId: DEMO_USER.id,
        email: payload.email,
        role: payload.role,
      });
      await setAuthCookies(accessToken, refreshToken);
      return ok({ message: "Token refreshed (demo mode)" });
    }

    // Verify old refresh token
    const payload = await verifyRefreshToken(oldRefreshToken);
    if (!payload) {
      return err("Invalid refresh token", 401);
    }

    // Find session
    const session = await prisma.session.findUnique({
      where: { refreshToken: oldRefreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return err("Session expired", 401);
    }

    // Rotate refresh token
    const accessToken = await createAccessToken({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
    });
    const newRefreshToken = await createRefreshToken({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
    });

    // Update session with new refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await setAuthCookies(accessToken, newRefreshToken);

    return ok({ message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh error:", error);
    return serverError();
  }
}
