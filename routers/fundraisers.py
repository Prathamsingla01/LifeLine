from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User, Fundraiser
from schemas import CreateFundraiserRequest, FundraiserResponse
from auth_utils import get_current_user
import uuid

router = APIRouter()


@router.post("/fundraisers", response_model=FundraiserResponse, status_code=201)
async def create_fundraiser(
    payload: CreateFundraiserRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    fundraiser = Fundraiser(
        id=str(uuid.uuid4()),
        creator_id=current_user.id,
        title=payload.title,
        description=payload.description,
        goal_amount=payload.goal_amount,
        raised_amount=0,
        verified=False,
        proof_document_url=payload.proof_document_url,
    )
    db.add(fundraiser)
    await db.commit()
    await db.refresh(fundraiser)
    return fundraiser


@router.get("/fundraisers", response_model=list[FundraiserResponse])
async def list_fundraisers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Fundraiser)
        .order_by(Fundraiser.created_at.desc())
        .limit(50)
    )
    return result.scalars().all()


@router.get("/fundraisers/{fundraiser_id}", response_model=FundraiserResponse)
async def get_fundraiser(fundraiser_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Fundraiser).where(Fundraiser.id == fundraiser_id))
    fundraiser = result.scalar_one_or_none()
    if not fundraiser:
        raise HTTPException(status_code=404, detail="Fundraiser not found")
    return fundraiser
