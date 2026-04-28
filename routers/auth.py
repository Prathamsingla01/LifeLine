from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User, Family
from schemas import RegisterRequest, RegisterResponse, LoginRequest, TokenResponse
from auth_utils import hash_password, verify_password, create_access_token
import uuid
import random
import string

router = APIRouter()


def generate_family_code() -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


@router.post("/register", response_model=RegisterResponse, status_code=201)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check email uniqueness
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    # Resolve or create family
    family_id = None
    if payload.family_code:
        result = await db.execute(
            select(Family).where(Family.group_code == payload.family_code)
        )
        family = result.scalar_one_or_none()
        if not family:
            raise HTTPException(status_code=404, detail="Family group code not found")
        family_id = family.id
    else:
        # Auto-create a new family for this user
        new_family = Family(
            id=str(uuid.uuid4()),
            group_code=generate_family_code(),
        )
        db.add(new_family)
        await db.flush()
        family_id = new_family.id

    # Create user
    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        name=payload.name or "User",
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role.value,
        medical_profile=payload.medical_profile.model_dump() if payload.medical_profile else None,
        family_id=family_id,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(str(user.id))
    return RegisterResponse(
        user_id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        access_token=token,
    )


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        user_id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
    )


@router.get("/me")
async def get_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(lambda: None),  # placeholder
):
    """Get current user profile — requires auth token."""
    from auth_utils import get_current_user
    # This is handled by the dependency
    pass
