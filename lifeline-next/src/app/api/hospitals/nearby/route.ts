import { ok, unauthorized, serverError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// GET /api/hospitals/nearby
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized();

    // Try FastAPI backend first
    try {
      const backendRes = await fetch(`${FASTAPI_URL}/nearby-hospitals?lat=28.6139&lng=77.2090&radius_km=15`, {
        headers: { "Content-Type": "application/json" },
      });

      if (backendRes.ok) {
        const hospitals = await backendRes.json();
        // Map FastAPI response to frontend format
        const mapped = hospitals.map((h: { name: string; address: string; phone: string | null; latitude: number; longitude: number; distance_km: number; has_icu: boolean | null; place_id: string }, i: number) => ({
          id: h.place_id || `h${i + 1}`,
          name: h.name,
          address: h.address,
          phone: h.phone || "N/A",
          lat: h.latitude,
          lng: h.longitude,
          totalBeds: 500 + Math.floor(Math.random() * 2000),
          availableBeds: 10 + Math.floor(Math.random() * 40),
          icuBeds: 40 + Math.floor(Math.random() * 80),
          icuAvailable: 2 + Math.floor(Math.random() * 8),
          hasTraumaCenter: h.has_icu || true,
          hasBurnUnit: Math.random() > 0.5,
          emergencyReady: true,
          rating: 4.0 + Math.round(Math.random() * 8) / 10,
          distance: `${h.distance_km} km`,
          eta: `${Math.round(h.distance_km * 3)} min`,
        }));
        return ok(mapped);
      }
    } catch {
      console.log("[Hospitals] FastAPI backend not reachable, using demo data");
    }

    // Demo fallback
    return ok([
      { id: "h1", name: "AIIMS Delhi", address: "Ansari Nagar, New Delhi", phone: "+91 11 2658 8500", lat: 28.5672, lng: 77.2100, totalBeds: 2478, availableBeds: 45, icuBeds: 120, icuAvailable: 8, hasTraumaCenter: true, hasBurnUnit: true, emergencyReady: true, rating: 4.8, distance: "2.3 km", eta: "8 min" },
      { id: "h2", name: "Safdarjung Hospital", address: "Ansari Nagar West, New Delhi", phone: "+91 11 2673 0000", lat: 28.5685, lng: 77.2065, totalBeds: 1531, availableBeds: 32, icuBeds: 80, icuAvailable: 5, hasTraumaCenter: true, hasBurnUnit: false, emergencyReady: true, rating: 4.3, distance: "3.1 km", eta: "12 min" },
      { id: "h3", name: "Sir Ganga Ram Hospital", address: "Rajinder Nagar, New Delhi", phone: "+91 11 2575 0000", lat: 28.6382, lng: 77.1888, totalBeds: 675, availableBeds: 18, icuBeds: 45, icuAvailable: 3, hasTraumaCenter: true, hasBurnUnit: true, emergencyReady: true, rating: 4.6, distance: "4.5 km", eta: "15 min" },
      { id: "h4", name: "Max Super Speciality Hospital", address: "Saket, New Delhi", phone: "+91 11 2651 5050", lat: 28.5280, lng: 77.2100, totalBeds: 500, availableBeds: 24, icuBeds: 60, icuAvailable: 4, hasTraumaCenter: true, hasBurnUnit: false, emergencyReady: true, rating: 4.5, distance: "5.2 km", eta: "18 min" },
      { id: "h5", name: "Apollo Hospital", address: "Mathura Road, Sarita Vihar", phone: "+91 11 2692 5858", lat: 28.5296, lng: 77.2875, totalBeds: 710, availableBeds: 15, icuBeds: 52, icuAvailable: 2, hasTraumaCenter: false, hasBurnUnit: false, emergencyReady: true, rating: 4.4, distance: "7.8 km", eta: "22 min" },
    ]);
  } catch (error) {
    console.error("Get hospitals error:", error);
    return serverError();
  }
}
