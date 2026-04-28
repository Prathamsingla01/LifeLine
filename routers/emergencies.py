from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User, Emergency
from schemas import ReportEmergencyRequest, EmergencyResponse, UpdateEmergencyStatusRequest, EmergencyStatus
from auth_utils import get_current_user
import uuid

router = APIRouter()


@router.post("/report-emergency", response_model=EmergencyResponse, status_code=201)
async def report_emergency(
    payload: ReportEmergencyRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    emergency = Emergency(
        id=str(uuid.uuid4()),
        reporter_id=current_user.id,
        type=payload.type.value,
        latitude=payload.latitude,
        longitude=payload.longitude,
        description=payload.description,
        status=EmergencyStatus.pending.value,
    )
    db.add(emergency)
    await db.commit()
    await db.refresh(emergency)

    return EmergencyResponse(
        emergency_id=emergency.id,
        type=emergency.type,
        status=emergency.status,
        latitude=emergency.latitude,
        longitude=emergency.longitude,
        description=emergency.description,
        created_at=emergency.created_at,
    )


@router.patch("/emergencies/{emergency_id}/status", response_model=EmergencyResponse)
async def update_emergency_status(
    emergency_id: str,
    payload: UpdateEmergencyStatusRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Emergency).where(Emergency.id == emergency_id))
    emergency = result.scalar_one_or_none()

    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency not found")

    if emergency.reporter_id != current_user.id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    emergency.status = payload.status.value
    await db.commit()
    await db.refresh(emergency)

    return EmergencyResponse(
        emergency_id=emergency.id,
        type=emergency.type,
        status=emergency.status,
        latitude=emergency.latitude,
        longitude=emergency.longitude,
        description=emergency.description,
        created_at=emergency.created_at,
    )


@router.get("/emergencies", response_model=list[EmergencyResponse])
async def list_emergencies(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Emergency)
        .where(Emergency.reporter_id == current_user.id)
        .order_by(Emergency.created_at.desc())
    )
    emergencies = result.scalars().all()
    return [
        EmergencyResponse(
            emergency_id=e.id,
            type=e.type,
            status=e.status,
            latitude=e.latitude,
            longitude=e.longitude,
            description=e.description,
            created_at=e.created_at,
        )
        for e in emergencies
    ]


@router.get("/all-emergencies", response_model=list[EmergencyResponse])
async def list_all_emergencies(db: AsyncSession = Depends(get_db)):
    """Public: list all recent emergencies (for feed)."""
    result = await db.execute(
        select(Emergency)
        .order_by(Emergency.created_at.desc())
        .limit(50)
    )
    emergencies = result.scalars().all()
    return [
        EmergencyResponse(
            emergency_id=e.id,
            type=e.type,
            status=e.status,
            latitude=e.latitude,
            longitude=e.longitude,
            description=e.description,
            created_at=e.created_at,
        )
        for e in emergencies
    ]
