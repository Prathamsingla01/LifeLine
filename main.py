from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, emergencies, hospitals, fundraisers, user, family, feed
from database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables if they don't exist."""
    try:
        await init_db()
        print("[OK] Database tables initialized")
    except Exception as e:
        print(f"[WARN] Database not available: {e}")
    yield


app = FastAPI(
    title="LifeLine API",
    description="Emergency response and family safety platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(user.router, prefix="/api/v1", tags=["user"])
app.include_router(emergencies.router, prefix="/api/v1", tags=["emergencies"])
app.include_router(hospitals.router, prefix="/api/v1", tags=["hospitals"])
app.include_router(fundraisers.router, prefix="/api/v1", tags=["fundraisers"])
app.include_router(family.router, prefix="/api/v1", tags=["family"])
app.include_router(feed.router, prefix="/api/v1", tags=["feed"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "lifeline-api", "version": "1.0.0"}
