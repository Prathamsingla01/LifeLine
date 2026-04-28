from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User, Family, FamilyMember, Geofence
from auth_utils import get_current_user

router = APIRouter()


@router.get("/family")
async def get_family(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get family info, members, and geofences."""
    if not current_user.family_id:
        return {"success": True, "data": {"family": None, "members": [], "geofences": []}}

    # Family info
    result = await db.execute(select(Family).where(Family.id == current_user.family_id))
    family = result.scalar_one_or_none()

    # Members
    result = await db.execute(
        select(FamilyMember).where(FamilyMember.family_id == current_user.family_id)
    )
    members = result.scalars().all()

    # Geofences
    result = await db.execute(
        select(Geofence).where(Geofence.family_id == current_user.family_id)
    )
    geofences = result.scalars().all()

    return {
        "success": True,
        "data": {
            "family": {
                "id": family.id if family else None,
                "name": family.name if family else None,
                "inviteCode": family.group_code if family else None,
            },
            "members": [
                {
                    "id": m.id,
                    "userId": m.user_id,
                    "name": m.name,
                    "role": m.role,
                    "nickname": m.nickname,
                    "avatar": m.avatar,
                    "lat": m.lat,
                    "lng": m.lng,
                    "lastSeen": m.last_seen.isoformat() if m.last_seen else "",
                    "status": m.status,
                    "battery": m.battery,
                }
                for m in members
            ],
            "geofences": [
                {
                    "id": g.id,
                    "name": g.name,
                    "lat": g.lat,
                    "lng": g.lng,
                    "radiusM": g.radius_m,
                    "type": g.type,
                }
                for g in geofences
            ],
        },
    }
