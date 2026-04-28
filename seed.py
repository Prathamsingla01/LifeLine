"""Seed the database with demo data for hackathon."""
import asyncio
from datetime import datetime, timedelta
from database import AsyncSessionLocal, init_db
from models import (
    User, Family, Emergency, Fundraiser, Notification,
    UserSettings, SafetyScore, EmergencyContact, Badge,
    FamilyMember, Geofence,
)
from auth_utils import hash_password
import uuid


def uid():
    return str(uuid.uuid4())


DEMO_USER_ID = "demo-user-arjun-001"
DEMO_FAMILY_ID = "demo-family-mehta-001"


async def seed():
    await init_db()

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        from sqlalchemy import select
        existing = await db.execute(select(User).where(User.id == DEMO_USER_ID))
        if existing.scalar_one_or_none():
            print("[SEED] Already seeded, skipping.")
            return

        # ── Family ──
        family = Family(
            id=DEMO_FAMILY_ID,
            group_code="MEHTA-2025",
            name="Mehta Family",
        )
        db.add(family)

        # ── Main User ──
        user = User(
            id=DEMO_USER_ID,
            name="Arjun Mehta",
            email="arjun@email.com",
            phone="+91 98765 43210",
            hashed_password=hash_password("password123"),
            role="Child",
            lifeline_id="LL-00482",
            is_verified=True,
            medical_profile={
                "blood_type": "O+",
                "allergies": ["Penicillin"],
                "conditions": ["Asthma (mild)"],
                "medications": ["Inhaler (PRN)"],
                "emergency_contact": "Priya Mehta",
            },
            family_id=DEMO_FAMILY_ID,
        )
        db.add(user)

        # ── Settings ──
        db.add(UserSettings(
            id=uid(), user_id=DEMO_USER_ID,
            theme="dark", language="en",
            push_notifications=True, email_notifications=True,
            sms_alerts=True, location_sharing=True,
            crash_detection=True, crash_sensitivity="medium",
            auto_sos=False, sos_countdown=10, silent_mode=False,
        ))

        # ── Safety Score ──
        db.add(SafetyScore(
            id=uid(), user_id=DEMO_USER_ID,
            score=82, level=4, streak=12,
        ))

        # ── Emergency Contacts ──
        db.add(EmergencyContact(id=uid(), user_id=DEMO_USER_ID, name="Priya Mehta", phone="+91 98765 43211", relation="Spouse", priority=1))
        db.add(EmergencyContact(id=uid(), user_id=DEMO_USER_ID, name="Raj Mehta", phone="+91 98765 43212", relation="Father", priority=2))

        # ── Badges ──
        db.add(Badge(id=uid(), user_id=DEMO_USER_ID, badge="first_responder", awarded_at=datetime(2025, 1, 15)))
        db.add(Badge(id=uid(), user_id=DEMO_USER_ID, badge="safety_star", awarded_at=datetime(2025, 2, 1)))
        db.add(Badge(id=uid(), user_id=DEMO_USER_ID, badge="community_hero", awarded_at=datetime(2025, 3, 10)))

        # ── Family Members ──
        db.add(FamilyMember(id=uid(), family_id=DEMO_FAMILY_ID, user_id=DEMO_USER_ID, name="Arjun Mehta", role="ADMIN", lat=28.6139, lng=77.2090, status="online", battery=85))
        db.add(FamilyMember(id=uid(), family_id=DEMO_FAMILY_ID, user_id="u2", name="Priya Mehta", role="MEMBER", nickname="Priya", lat=28.6200, lng=77.2150, status="online", battery=62))
        db.add(FamilyMember(id=uid(), family_id=DEMO_FAMILY_ID, user_id="u3", name="Ananya Mehta", role="CHILD", nickname="Ananya", lat=28.5800, lng=77.3200, status="online", battery=45))
        db.add(FamilyMember(id=uid(), family_id=DEMO_FAMILY_ID, user_id="u4", name="Raj Mehta", role="MEMBER", nickname="Papa", lat=28.6500, lng=77.1800, status="offline", battery=30))

        # ── Geofences ──
        db.add(Geofence(id=uid(), family_id=DEMO_FAMILY_ID, name="Home", lat=28.6139, lng=77.2090, radius_m=200, type="safe"))
        db.add(Geofence(id=uid(), family_id=DEMO_FAMILY_ID, name="DPS School", lat=28.5800, lng=77.3200, radius_m=300, type="safe"))
        db.add(Geofence(id=uid(), family_id=DEMO_FAMILY_ID, name="Office", lat=28.6315, lng=77.2167, radius_m=500, type="safe"))

        # ── Emergencies ──
        now = datetime.utcnow()
        emergencies_data = [
            ("INC-2847", "accident", "critical", "Car Accident - Multi-vehicle", "Connaught Place, Delhi", 28.6315, 77.2167, "responding", 3, 2),
            ("INC-2846", "medical", "moderate", "Fall Injury - Elderly", "Karol Bagh, Delhi", 28.6519, 77.1909, "responding", 1, 5),
            ("INC-2845", "fire", "critical", "Building Fire - 3rd Floor", "Saket, Delhi", 28.5245, 77.2066, "active", 5, 8),
            ("INC-2844", "medical", "low", "Minor Injury - Sports", "Dwarka Sec-12", 28.5921, 77.0460, "resolved", 1, 15),
            ("INC-2843", "flood", "moderate", "Waterlogging - Road Blocked", "Yamuna Banks", 28.6800, 77.2500, "active", 2, 22),
            ("INC-2842", "other", "moderate", "Child Geofence Alert", "Sector 45, Noida", 28.5700, 77.3500, "resolved", 0, 35),
            ("INC-2841", "accident", "low", "Minor Fender Bender", "Rohini, Delhi", 28.7495, 77.0565, "resolved", 1, 45),
            ("INC-2840", "medical", "critical", "Cardiac Emergency", "Hauz Khas, Delhi", 28.5494, 77.2001, "resolved", 4, 60),
        ]
        for eid, etype, sev, title, loc, lat, lng, status, resp, mins_ago in emergencies_data:
            db.add(Emergency(
                id=eid, reporter_id=DEMO_USER_ID, type=etype, severity=sev,
                title=title, location=loc, latitude=lat, longitude=lng,
                status=status, responders=resp,
                created_at=now - timedelta(minutes=mins_ago),
            ))

        # ── Fundraisers ──
        db.add(Fundraiser(id="fr1", creator_id=DEMO_USER_ID, title="Flood Relief - Assam 2025",
            description="Supporting families displaced by devastating floods in Assam.",
            goal_amount=500000, raised_amount=342000, category="disaster_relief",
            verified=True, donor_count=248,
            created_at=now - timedelta(days=7)))
        db.add(Fundraiser(id="fr2", creator_id=DEMO_USER_ID, title="Burns Treatment - Rohit Kumar",
            description="12-year-old Rohit suffered severe burns in a house fire.",
            goal_amount=200000, raised_amount=156000, category="medical",
            verified=True, donor_count=124,
            created_at=now - timedelta(days=14)))
        db.add(Fundraiser(id="fr3", creator_id=DEMO_USER_ID, title="Earthquake Relief - Nepal Border",
            description="Emergency aid for communities affected by the earthquake.",
            goal_amount=1000000, raised_amount=720000, category="disaster_relief",
            verified=True, donor_count=512,
            created_at=now - timedelta(days=21)))

        # ── Notifications ──
        notifs = [
            ("EMERGENCY", "Flood Alert - Delhi NCR", "Moderate flood risk in Yamuna basin areas.", "W", "CRITICAL", False, 5),
            ("FAMILY", "Ananya arrived at school", "Geofence entered: DPS School, Sector 45", "V", "LOW", False, 60),
            ("SYSTEM", "Medical profile updated", "Your medical profile was synced successfully.", "M", "LOW", True, 120),
            ("EMERGENCY", "Accident near CP", "INC-2847: Car accident at Connaught Place.", "C", "MODERATE", True, 180),
            ("FUNDRAISER", "Donation received", "Rs.500 donated to Flood Relief Assam.", "D", "LOW", True, 1440),
            ("FAMILY", "Priya safety check-in", "Priya Mehta confirmed safe status.", "P", "LOW", True, 1440),
        ]
        for ntype, title, msg, icon, sev, read, mins_ago in notifs:
            db.add(Notification(
                id=uid(), user_id=DEMO_USER_ID, type=ntype,
                title=title, message=msg, icon=icon, severity=sev,
                read=read, created_at=now - timedelta(minutes=mins_ago),
            ))

        await db.commit()
        print("[SEED] Database seeded with demo data successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
