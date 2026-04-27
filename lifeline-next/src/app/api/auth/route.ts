export const dynamic = "force-static";
import { NextResponse } from "next/server";

/* Simulated JWT auth for hackathon demo */

const demoUsers: Record<string, { email: string; name: string; role: string; token: string }> = {
  "arjun@email.com": { email: "arjun@email.com", name: "Arjun Mehta", role: "user", token: "ll-jwt-demo-arjun-2025" },
  "hospital@aiims.in": { email: "hospital@aiims.in", name: "AIIMS Staff", role: "hospital_staff", token: "ll-jwt-demo-hospital-2025" },
  "admin@lifeline.in": { email: "admin@lifeline.in", name: "Admin", role: "admin", token: "ll-jwt-demo-admin-2025" },
};

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, action } = body;

  if (action === "register") {
    return NextResponse.json({
      success: true,
      message: "Account created (demo mode)",
      user: {
        id: "LL-USR-2025-DEMO",
        email: email || "demo@lifeline.in",
        name: body.name || "Demo User",
        role: body.role || "user",
      },
      access_token: "ll-jwt-demo-new-user-2025",
    }, { status: 201 });
  }

  // Login
  const user = demoUsers[email];
  if (user) {
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user,
      access_token: user.token,
    });
  }

  // Demo fallback — any email/pass works
  return NextResponse.json({
    success: true,
    message: "Login successful (demo mode)",
    user: {
      email: email || "demo@lifeline.in",
      name: "Demo User",
      role: "user",
    },
    access_token: "ll-jwt-demo-fallback-2025",
  });
}
