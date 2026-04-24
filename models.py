import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Numeric, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from database import Base
import enum

class UserRole(str, enum.Enum):
    child = "Child"
    elder = "Elder"
    admin = "Admin"

class EmergencyType(str, enum.Enum):
    medical = "Medical"
    fire = "Fire"
    accident = "Accident"
    other = "Other"

class EmergencyStatus(str, enum.Enum):
    pending = "Pending"
    responding = "Responding"
    resolved = "Resolved"


class Family(Base):
    __tablename__ = "families"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("User", back_populates="family")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.child)
    medical_profile = Column(JSONB, nullable=True)
    family_id = Column(UUID(as_uuid=True), ForeignKey("families.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    family = relationship("Family", back_populates="members")
    emergencies = relationship("Emergency", back_populates="reporter")
    fundraisers = relationship("Fundraiser", back_populates="creator")


class Emergency(Base):
    __tablename__ = "emergencies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(Enum(EmergencyType), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(EmergencyStatus), default=EmergencyStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("User", back_populates="emergencies")


class Fundraiser(Base):
    __tablename__ = "fundraisers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    goal_amount = Column(Numeric(12, 2), nullable=False)
    raised_amount = Column(Numeric(12, 2), default=0)
    verified = Column(Boolean, default=False)
    proof_document_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", back_populates="fundraisers")
