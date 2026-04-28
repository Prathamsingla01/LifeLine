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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["USER", "HOSPITAL_STAFF"]).optional().default("USER"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return err(parsed.error.issues[0].message, 422);
    }

    const { name, email, password, role } = parsed.data;

    // Try FastAPI backend first
    try {
      const backendRes = await fetch(`${FASTAPI_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();

        const mappedRole = role || "USER";
        const accessToken = await createAccessToken({
          userId: data.user_id,
          email: data.email,
          role: mappedRole,
        });
        const refreshToken = await createRefreshToken({
          userId: data.user_id,
          email: data.email,
          role: mappedRole,
        });
        await setAuthCookies(accessToken, refreshToken);

        return ok({
          user: {
            id: data.user_id,
            name: data.name || name,
            email: data.email,
            role: mappedRole,
            avatar: null,
            lifelineId: `LL-${data.user_id.slice(0, 5).toUpperCase()}`,
            isVerified: true,
          },
          message: "Account created (FastAPI backend)",
        }, 201);
      }

      if (backendRes.status === 409) {
        return err("Email already registered", 409);
      }
    } catch {
      console.log("[Auth] FastAPI backend not reachable, using demo mode");
    }

    // Demo mode fallback
    const accessToken = await createAccessToken({
      userId: DEMO_USER.id,
      email,
      role: role || "USER",
    });
    const refreshToken = await createRefreshToken({
      userId: DEMO_USER.id,
      email,
      role: role || "USER",
    });
    await setAuthCookies(accessToken, refreshToken);

    return ok(
      {
        user: { ...DEMO_USER, name, email, role },
        message: "Account created (demo mode)",
      },
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return serverError();
  }
}
