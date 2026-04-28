import { ok, err, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDemoMode } from "@/lib/db";
import { NextRequest } from "next/server";
import { z } from "zod/v4";

const emergencySchema = z.object({
  type: z.enum(["ACCIDENT", "FIRE", "FLOOD", "MEDICAL", "CHILD_SAFETY", "EARTHQUAKE", "VIOLENCE", "OTHER"]),
  severity: z.enum(["CRITICAL", "MODERATE", "LOW"]),
  title: z.string().min(3),
  description: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional(),
});

// GET /api/emergencies
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (await isDemoMode()) {
      const demoEmergencies = [
        { id: "INC-2847", type: "ACCIDENT", severity: "CRITICAL", title: "Car Accident — Multi-vehicle", location: "Connaught Place, Delhi", status: "RESPONDING", responders: 3, createdAt: new Date(Date.now() - 120000).toISOString(), lat: 28.6315, lng: 77.2167 },
        { id: "INC-2846", type: "MEDICAL", severity: "MODERATE", title: "Fall Injury — Elderly", location: "Karol Bagh, Delhi", status: "RESPONDING", responders: 1, createdAt: new Date(Date.now() - 300000).toISOString(), lat: 28.6519, lng: 77.1909 },
        { id: "INC-2845", type: "FIRE", severity: "CRITICAL", title: "Building Fire — 3rd Floor", location: "Saket, Delhi", status: "ACTIVE", responders: 5, createdAt: new Date(Date.now() - 480000).toISOString(), lat: 28.5245, lng: 77.2066 },
        { id: "INC-2844", type: "MEDICAL", severity: "LOW", title: "Minor Injury — Sports", location: "Dwarka Sec-12", status: "RESOLVED", responders: 1, createdAt: new Date(Date.now() - 900000).toISOString(), lat: 28.5921, lng: 77.0460 },
        { id: "INC-2843", type: "FLOOD", severity: "MODERATE", title: "Waterlogging — Road Blocked", location: "Yamuna Banks", status: "ACTIVE", responders: 2, createdAt: new Date(Date.now() - 1320000).toISOString(), lat: 28.6800, lng: 77.2500 },
      ];
      return ok(demoEmergencies);
    }

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const emergencies = await prisma.emergency.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { reporter: { select: { name: true } } },
    });

    return ok(emergencies);
  } catch (error) {
    console.error("Get emergencies error:", error);
    return serverError();
  }
}

// POST /api/emergencies
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const parsed = emergencySchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message, 422);

    if (await isDemoMode()) {
      return ok({
        id: `INC-${Date.now().toString().slice(-4)}`,
        ...parsed.data,
        status: "ACTIVE",
        responders: 0,
        reporterId: user.userId,
        createdAt: new Date().toISOString(),
        message: "Emergency reported (demo mode)",
      }, 201);
    }

    const emergency = await prisma.emergency.create({
      data: {
        ...parsed.data,
        reporterId: user.userId,
      },
    });

    return ok(emergency, 201);
  } catch (error) {
    console.error("Create emergency error:", error);
    return serverError();
  }
}
