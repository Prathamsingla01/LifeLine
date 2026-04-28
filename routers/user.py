from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import (User, UserSettings, SafetyScore, EmergencyContact, Badge, Notification)
from auth_utils import get_current_user

router = APIRouter()


@router.get("/me")
async def get_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get full user profile with settings, score, badges, contacts."""
    # Settings
    result = await db.execute(select(UserSettings).where(UserSettings.user_id == current_user.id))
    settings = result.scalar_one_or_none()

    # Safety Score
    result = await db.execute(select(SafetyScore).where(SafetyScore.user_id == current_user.id))
    score = result.scalar_one_or_none()

    # Emergency Contacts
    result = await db.execute(
        select(EmergencyContact)
        .where(EmergencyContact.user_id == current_user.id)
        .order_by(EmergencyContact.priority)
    )
    contacts = result.scalars().all()

    # Badges
    result = await db.execute(
        select(Badge)
        .where(Badge.user_id == current_user.id)
        .order_by(Badge.awarded_at.desc())
    )
    badges = result.scalars().all()

    return {
        "success": True,
        "data": {
            "user": {
                "id": current_user.id,
                "name": current_user.name,
                "email": current_user.email,
                "phone": current_user.phone,
                "role": "USER" if current_user.role == "Child" else "ADMIN" if current_user.role == "Admin" else current_user.role,
                "avatar": current_user.avatar,
                "lifelineId": current_user.lifeline_id or f"LL-{current_user.id[:5].upper()}",
                "isVerified": current_user.is_verified,
            },
            "profile": {
                "bloodType": (current_user.medical_profile or {}).get("blood_type", "O+"),
                "allergies": (current_user.medical_profile or {}).get("allergies", []),
                "conditions": (current_user.medical_profile or {}).get("conditions", []),
                "medications": (current_user.medical_profile or {}).get("medications", []),
                "emergencyNotes": (current_user.medical_profile or {}).get("emergency_contact", ""),
                "organDonor": True,
                "insuranceProvider": "Star Health",
                "insurancePolicyNo": "SH-2025-482901",
                "primaryDoctor": "Dr. Sharma",
                "primaryDoctorPhone": "+91 98765 43210",
                "height": 175,
                "weight": 72,
            },
            "settings": {
                "theme": settings.theme if settings else "dark",
                "language": settings.language if settings else "en",
                "pushNotifications": settings.push_notifications if settings else True,
                "emailNotifications": settings.email_notifications if settings else True,
                "smsAlerts": settings.sms_alerts if settings else True,
                "locationSharing": settings.location_sharing if settings else True,
                "crashDetection": settings.crash_detection if settings else True,
                "crashSensitivity": settings.crash_sensitivity if settings else "medium",
                "autoSOS": settings.auto_sos if settings else False,
                "sosCountdown": settings.sos_countdown if settings else 10,
                "silentMode": settings.silent_mode if settings else False,
            },
            "safetyScore": {
                "score": score.score if score else 82,
                "level": score.level if score else 4,
                "streak": score.streak if score else 12,
            },
            "badges": [
                {"badge": b.badge, "awardedAt": b.awarded_at.isoformat() if b.awarded_at else ""}
                for b in badges
            ],
            "emergencyContacts": [
                {"id": c.id, "name": c.name, "phone": c.phone, "relation": c.relation, "priority": c.priority}
                for c in contacts
            ],
        },
    }


@router.get("/notifications")
async def get_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
    )
    notifs = result.scalars().all()

    return {
        "success": True,
        "data": [
            {
                "id": n.id,
                "type": n.type,
                "title": n.title,
                "message": n.message,
                "icon": n.icon,
                "severity": n.severity,
                "read": n.read,
                "createdAt": n.created_at.isoformat() if n.created_at else "",
            }
            for n in notifs
        ],
    }


@router.post("/notifications/{notif_id}/read")
async def mark_notification_read(
    notif_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Notification).where(Notification.id == notif_id))
    notif = result.scalar_one_or_none()
    if notif and notif.user_id == current_user.id:
        notif.read = True
        await db.commit()
    return {"success": True}


@router.post("/notifications/read-all")
async def mark_all_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from sqlalchemy import update
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id)
        .values(read=True)
    )
    await db.commit()
    return {"success": True}
