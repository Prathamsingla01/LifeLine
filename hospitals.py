from fastapi import APIRouter, Query, HTTPException
import httpx
import math
from schemas import HospitalResult
from config import settings

router = APIRouter()


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate straight-line distance between two coordinates in km."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))


@router.get("/nearby-hospitals", response_model=list[HospitalResult])
async def nearby_hospitals(
    lat: float = Query(..., ge=-90, le=90, description="Your latitude"),
    lng: float = Query(..., ge=-180, le=180, description="Your longitude"),
    radius_km: float = Query(10.0, ge=1, le=50, description="Search radius in km"),
):
    if not settings.GOOGLE_PLACES_API_KEY:
        raise HTTPException(status_code=503, detail="Maps API key not configured")

    radius_meters = int(radius_km * 1000)
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

    params = {
        "location": f"{lat},{lng}",
        "radius": radius_meters,
        "type": "hospital",
        "key": settings.GOOGLE_PLACES_API_KEY,
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch hospital data")

    data = response.json()
    results = []

    for place in data.get("results", []):
        loc = place["geometry"]["location"]
        distance = haversine_km(lat, lng, loc["lat"], loc["lng"])

        results.append(HospitalResult(
            name=place.get("name", "Unknown"),
            address=place.get("vicinity", ""),
            distance_km=round(distance, 2),
            phone=place.get("formatted_phone_number"),
            has_icu=None,  # Not available from Places API — enrich from your own DB
            latitude=loc["lat"],
            longitude=loc["lng"],
            place_id=place["place_id"],
        ))

    # Sort by distance
    results.sort(key=lambda h: h.distance_km)
    return results
