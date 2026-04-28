import { ok, err, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser, DEMO_USER } from "@/lib/auth";
import { prisma, isDemoMode } from "@/lib/db";
import { NextRequest } from "next/server";

// GET /api/profile — get user's medical profile
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    if (await isDemoMode()) {
      return ok({
        bloodType: "O+",
        allergies: ["Penicillin"],
        conditions: ["Asthma (mild)"],
        medications: ["Inhaler (PRN)"],
        emergencyNotes: "Carry inhaler at all times",
        organDonor: true,
        insuranceProvider: "Star Health",
        insurancePolicyNo: "SH-2025-482901",
        primaryDoctor: "Dr. Sharma",
        primaryDoctorPhone: "+91 98765 43210",
        height: 175,
        weight: 72,
      });
    }

    const profile = await prisma.medicalProfile.findUnique({
      where: { userId: user.userId },
    });

    return ok(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    return serverError();
  }
}

// PUT /api/profile — update medical profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const body = await request.json();

    if (await isDemoMode()) {
      return ok({ ...body, message: "Profile updated (demo mode)" });
    }

    const profile = await prisma.medicalProfile.upsert({
      where: { userId: user.userId },
      update: body,
      create: { userId: user.userId, ...body },
    });

    return ok(profile);
  } catch (error) {
    console.error("Update profile error:", error);
    return serverError();
  }
}
