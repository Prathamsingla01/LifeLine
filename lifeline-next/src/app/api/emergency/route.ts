export const dynamic = "force-static";
import { NextResponse } from "next/server";

/* In-memory emergency store for hackathon demo */
const emergencies = [
  { id: "INC-2847", type: "accident", severity: "critical", lat: 28.6315, lng: 77.2167, location: "Connaught Place, Delhi", status: "responding", reporter: "Auto-SOS", time: new Date().toISOString(), description: "Car accident detected via accelerometer — 47.2g impact" },
  { id: "INC-2846", type: "medical", severity: "moderate", lat: 28.6448, lng: 77.1900, location: "Karol Bagh, Delhi", status: "assigned", reporter: "Manual SOS", time: new Date().toISOString(), description: "Fall injury reported — elderly patient" },
  { id: "INC-2845", type: "fire", severity: "critical", lat: 28.5250, lng: 77.2100, location: "Saket, Delhi", status: "enroute", reporter: "Fire Dept", time: new Date().toISOString(), description: "Building fire — 3rd floor residential" },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: emergencies.length,
    data: emergencies,
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const newEmergency = {
    id: `INC-${2847 + emergencies.length + 1}`,
    type: body.type || "medical",
    severity: body.severity || "moderate",
    lat: body.latitude || 28.6139,
    lng: body.longitude || 77.2090,
    location: body.location || "Unknown Location",
    status: "pending",
    reporter: body.reporter || "Anonymous",
    time: new Date().toISOString(),
    description: body.description || "",
  };

  emergencies.push(newEmergency);

  return NextResponse.json({
    success: true,
    message: "Emergency reported successfully",
    data: newEmergency,
  }, { status: 201 });
}
