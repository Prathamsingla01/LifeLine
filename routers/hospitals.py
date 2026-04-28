from fastapi import APIRouter, Query, HTTPException
import math
from schemas import HospitalResult

router = APIRouter()


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))


# Demo hospital data for Delhi NCR
DEMO_HOSPITALS = [
    {"name": "AIIMS Delhi", "address": "Sri Aurobindo Marg, Ansari Nagar", "lat": 28.5672, "lng": 77.2100, "phone": "+91-11-26588500", "has_icu": True, "place_id": "hosp-1"},
    {"name": "Safdarjung Hospital", "address": "Ring Road, New Delhi", "lat": 28.5681, "lng": 77.2066, "phone": "+91-11-26707437", "has_icu": True, "place_id": "hosp-2"},
    {"name": "Max Super Speciality", "address": "Saket, New Delhi", "lat": 28.5245, "lng": 77.2066, "phone": "+91-11-26515050", "has_icu": True, "place_id": "hosp-3"},
    {"name": "Fortis Hospital", "address": "Vasant Kunj, New Delhi", "lat": 28.5215, "lng": 77.1567, "phone": "+91-11-42776222", "has_icu": True, "place_id": "hosp-4"},
    {"name": "Apollo Hospital", "address": "Mathura Road, Sarita Vihar", "lat": 28.5310, "lng": 77.2891, "phone": "+91-11-71791090", "has_icu": True, "place_id": "hosp-5"},
    {"name": "Sir Ganga Ram Hospital", "address": "Rajinder Nagar, New Delhi", "lat": 28.6381, "lng": 77.1864, "phone": "+91-11-25861243", "has_icu": True, "place_id": "hosp-6"},
    {"name": "Lok Nayak Hospital", "address": "Jawaharlal Nehru Marg", "lat": 28.6365, "lng": 77.2415, "phone": "+91-11-23232400", "has_icu": True, "place_id": "hosp-7"},
    {"name": "GTB Hospital", "address": "Dilshad Garden, Delhi", "lat": 28.6866, "lng": 77.3098, "phone": "+91-11-22586262", "has_icu": True, "place_id": "hosp-8"},
    {"name": "BLK-Max Hospital", "address": "Pusa Road, New Delhi", "lat": 28.6418, "lng": 77.1780, "phone": "+91-11-30403040", "has_icu": True, "place_id": "hosp-9"},
    {"name": "Medanta - The Medicity", "address": "Sector 38, Gurgaon", "lat": 28.4395, "lng": 77.0426, "phone": "+91-124-4141414", "has_icu": True, "place_id": "hosp-10"},
]


@router.get("/nearby-hospitals", response_model=list[HospitalResult])
async def nearby_hospitals(
    lat: float = Query(28.6139, ge=-90, le=90, description="Your latitude"),
    lng: float = Query(77.2090, ge=-180, le=180, description="Your longitude"),
    radius_km: float = Query(10.0, ge=1, le=50, description="Search radius in km"),
):
    """Return nearby hospitals. Uses demo data (no Google API key needed)."""
    results = []

    for h in DEMO_HOSPITALS:
        distance = haversine_km(lat, lng, h["lat"], h["lng"])
        if distance <= radius_km:
            results.append(HospitalResult(
                name=h["name"],
                address=h["address"],
                distance_km=round(distance, 2),
                phone=h.get("phone"),
                has_icu=h.get("has_icu"),
                latitude=h["lat"],
                longitude=h["lng"],
                place_id=h["place_id"],
            ))

    results.sort(key=lambda h: h.distance_km)
    return results
