import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import {
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  DEMO_USER,
} from "@/lib/auth";
import { z } from "zod/v4";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return err(parsed.error.issues[0].message, 422);
    }

    const { email, password } = parsed.data;

    // Try FastAPI backend first
    try {
      const backendRes = await fetch(`${FASTAPI_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        
        // Create Next.js session cookies using FastAPI's user data
        const accessToken = await createAccessToken({
          userId: data.user_id,
          email: data.email,
          role: data.role === "Child" ? "USER" : data.role === "Admin" ? "ADMIN" : "USER",
        });
        const refreshToken = await createRefreshToken({
          userId: data.user_id,
          email: data.email,
          role: data.role === "Child" ? "USER" : data.role === "Admin" ? "ADMIN" : "USER",
        });
        await setAuthCookies(accessToken, refreshToken);

        return ok({
          user: {
            id: data.user_id,
            name: data.name || "User",
            email: data.email,
            role: data.role === "Child" ? "USER" : data.role === "Admin" ? "ADMIN" : "USER",
            avatar: null,
            lifelineId: `LL-${data.user_id.slice(0, 5).toUpperCase()}`,
            isVerified: true,
          },
          backendToken: data.access_token,
          message: "Login successful (FastAPI backend)",
        });
      }

      if (backendRes.status === 401) {
        return err("Invalid email or password", 401);
      }
    } catch {
      // FastAPI not available — fall through to demo mode
      console.log("[Auth] FastAPI backend not reachable, using demo mode");
    }

    // Demo mode fallback — accept any credentials
    const demoRole = email.includes("hospital")
      ? "HOSPITAL_STAFF"
      : email.includes("admin")
      ? "ADMIN"
      : "USER";

    const accessToken = await createAccessToken({
      userId: DEMO_USER.id,
      email,
      role: demoRole,
    });
    const refreshToken = await createRefreshToken({
      userId: DEMO_USER.id,
      email,
      role: demoRole,
    });
    await setAuthCookies(accessToken, refreshToken);

    return ok({
      user: { ...DEMO_USER, email, role: demoRole },
      message: "Login successful (demo mode)",
    });
  } catch (error) {
    console.error("Login error:", error);
    return serverError();
  }
}
