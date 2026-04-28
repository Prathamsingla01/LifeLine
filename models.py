import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base


def gen_uuid():
    return str(uuid.uuid4())


# ── Core Models ──

class Family(Base):
    __tablename__ = "families"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    group_code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    members = relationship("User", back_populates="family")


class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=True, default="User")
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="Child")
    avatar = Column(String(500), nullable=True)
    lifeline_id = Column(String(20), nullable=True)
    is_verified = Column(Boolean, default=True)
    medical_profile = Column(JSON, nullable=True)
    family_id = Column(String(36), ForeignKey("families.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    family = relationship("Family", back_populates="members")
    emergencies = relationship("Emergency", back_populates="reporter")
    fundraisers = relationship("Fundraiser", back_populates="creator")
    notifications = relationship("Notification", back_populates="user")
    settings = relationship("UserSettings", back_populates="user", uselist=False)
    safety_score = relationship("SafetyScore", back_populates="user", uselist=False)
    emergency_contacts = relationship("EmergencyContact", back_populates="user")
    badges = relationship("Badge", back_populates="user")


class Emergency(Base):
    __tablename__ = "emergencies"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    reporter_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False)
    severity = Column(String(20), default="moderate")
    title = Column(String(200), nullable=True)
    location = Column(String(200), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default="Pending")
    responders = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    reporter = relationship("User", back_populates="emergencies")


class Fundraiser(Base):
    __tablename__ = "fundraisers"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    creator_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    goal_amount = Column(Float, nullable=False)
    raised_amount = Column(Float, default=0)
    category = Column(String(50), default="disaster_relief")
    verified = Column(Boolean, default=False)
    donor_count = Column(Integer, default=0)
    proof_document_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    creator = relationship("User", back_populates="fundraisers")


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False)  # EMERGENCY, FAMILY, SYSTEM, FUNDRAISER
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=True)
    icon = Column(String(10), nullable=True)
    severity = Column(String(20), default="LOW")
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="notifications")


class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    theme = Column(String(10), default="dark")
    language = Column(String(5), default="en")
    push_notifications = Column(Boolean, default=True)
    email_notifications = Column(Boolean, default=True)
    sms_alerts = Column(Boolean, default=True)
    location_sharing = Column(Boolean, default=True)
    crash_detection = Column(Boolean, default=True)
    crash_sensitivity = Column(String(10), default="medium")
    auto_sos = Column(Boolean, default=False)
    sos_countdown = Column(Integer, default=10)
    silent_mode = Column(Boolean, default=False)
    user = relationship("User", back_populates="settings")


class SafetyScore(Base):
    __tablename__ = "safety_scores"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    score = Column(Integer, default=82)
    level = Column(Integer, default=4)
    streak = Column(Integer, default=12)
    user = relationship("User", back_populates="safety_score")


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    relation = Column(String(50), nullable=False)
    priority = Column(Integer, default=1)
    user = relationship("User", back_populates="emergency_contacts")


class Badge(Base):
    __tablename__ = "badges"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    badge = Column(String(50), nullable=False)
    awarded_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="badges")


class FamilyMember(Base):
    __tablename__ = "family_members"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    family_id = Column(String(36), ForeignKey("families.id"), nullable=False)
    user_id = Column(String(36), nullable=True)
    name = Column(String(100), nullable=False)
    role = Column(String(20), default="MEMBER")
    nickname = Column(String(50), nullable=True)
    avatar = Column(String(500), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    last_seen = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="online")
    battery = Column(Integer, default=100)


class Geofence(Base):
    __tablename__ = "geofences"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    family_id = Column(String(36), ForeignKey("families.id"), nullable=False)
    name = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    radius_m = Column(Integer, default=200)
    type = Column(String(20), default="safe")
