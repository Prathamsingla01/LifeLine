from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Emergency
from datetime import datetime, timedelta

router = APIRouter()


def time_ago(dt: datetime) -> str:
    """Convert datetime to human-readable time ago string."""
    diff = datetime.utcnow() - dt
    mins = int(diff.total_seconds() / 60)
    if mins < 1:
        return "just now"
    if mins < 60:
        return f"{mins} min ago"
    hours = mins // 60
    if hours < 24:
        return f"{hours}h ago"
    days = hours // 24
    return f"{days}d ago"


@router.get("/feed")
async def get_feed(db: AsyncSession = Depends(get_db)):
    """Public emergency feed — no auth required for hackathon demo."""
    result = await db.execute(
        select(Emergency)
        .order_by(Emergency.created_at.desc())
        .limit(20)
    )
    emergencies = result.scalars().all()

    # Map emergency type to frontend type
    type_map = {
        "medical": "medical",
        "Medical": "medical",
        "fire": "fire",
        "Fire": "fire",
        "accident": "accident",
        "Accident": "accident",
        "flood": "flood",
        "other": "other",
        "Other": "other",
    }

    status_map = {
        "Pending": "active",
        "pending": "active",
        "Responding": "responding",
        "responding": "responding",
        "Resolved": "resolved",
        "resolved": "resolved",
        "active": "active",
    }

    return {
        "success": True,
        "data": [
            {
                "id": e.id,
                "type": type_map.get(e.type, "other"),
                "severity": e.severity or "moderate",
                "title": e.title or f"{e.type} Emergency",
                "location": e.location or f"{e.latitude:.2f}, {e.longitude:.2f}",
                "time": time_ago(e.created_at) if e.created_at else "unknown",
                "status": status_map.get(e.status, "active"),
                "responders": e.responders or 0,
                "lat": e.latitude,
                "lng": e.longitude,
            }
            for e in emergencies
        ],
    }
