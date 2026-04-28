import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { hash, compare } from "bcryptjs";
import { cookies } from "next/headers";

// ── Secrets ──
const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lifeline-jwt-secret-key-2025-hackathon"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "lifeline-refresh-secret-key-2025-hackathon"
);

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

// ── Token Payloads ──
export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// ── Create Tokens ──
export async function createAccessToken(payload: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TTL)
    .sign(ACCESS_SECRET);
}

export async function createRefreshToken(payload: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TTL)
    .sign(REFRESH_SECRET);
}

// ── Verify Tokens ──
export async function verifyAccessToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

// ── Password Hashing ──
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ── Cookie Management ──
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  cookieStore.set("ll-access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 min
  });

  cookieStore.set("ll-refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("ll-access-token");
  cookieStore.delete("ll-refresh-token");
}

// ── Get Current User from Cookies ──
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ll-access-token")?.value;

  if (!accessToken) return null;
  return verifyAccessToken(accessToken);
}

// ── Demo User (for hackathon mode without DB) ──
export const DEMO_USER = {
  id: "demo-user-001",
  email: "arjun@email.com",
  name: "Arjun Mehta",
  role: "USER" as const,
  lifelineId: "LL-2025-ARJUN",
  avatar: null,
  isVerified: true,
};
