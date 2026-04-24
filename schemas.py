from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Any
from uuid import UUID
from datetime import datetime
from models import UserRole, EmergencyType, EmergencyStatus


# --- Auth schemas ---

class MedicalProfile(BaseModel):
    blood_type: Optional[str] = None
    allergies: Optional[list[str]] = []
    conditions: Optional[list[str]] = []
    medications: Optional[list[str]] = []
    emergency_contact: Optional[str] = None

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.child
    medical_profile: Optional[MedicalProfile] = None
    family_code: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class RegisterResponse(BaseModel):
    user_id: UUID
    email: str
    role: UserRole
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- Emergency schemas ---

class ReportEmergencyRequest(BaseModel):
    type: EmergencyType
    latitude: float
    longitude: float
    description: Optional[str] = None

    @field_validator("latitude")
    @classmethod
    def validate_lat(cls, v):
        if not -90 <= v <= 90:
            raise ValueError("Latitude must be between -90 and 90")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_lng(cls, v):
        if not -180 <= v <= 180:
            raise ValueError("Longitude must be between -180 and 180")
        return v

class EmergencyResponse(BaseModel):
    emergency_id: UUID
    type: EmergencyType
    status: EmergencyStatus
    latitude: float
    longitude: float
    created_at: datetime

    class Config:
        from_attributes = True

class UpdateEmergencyStatusRequest(BaseModel):
    status: EmergencyStatus


# --- Hospital schemas ---

class HospitalResult(BaseModel):
    name: str
    address: str
    distance_km: float
    phone: Optional[str] = None
    has_icu: Optional[bool] = None
    latitude: float
    longitude: float
    place_id: str


# --- Fundraiser schemas ---

class CreateFundraiserRequest(BaseModel):
    title: str
    description: Optional[str] = None
    goal_amount: float
    proof_document_url: Optional[str] = None

class FundraiserResponse(BaseModel):
    id: UUID
    title: str
    goal_amount: float
    raised_amount: float
    verified: bool
    created_at: datetime

    class Config:
        from_attributes = True
