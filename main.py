from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routers import auth, emergencies, hospitals, fundraisers, user, family, feed
from database import init_db
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
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


# Serve static CSS
@app.get("/styles.css")
async def serve_css():
    return FileResponse(os.path.join(BASE_DIR, "styles.css"), media_type="text/css")


# Serve index.html for root and any non-API path
@app.get("/")
@app.get("/index.html")
async def serve_index():
    return FileResponse(os.path.join(BASE_DIR, "index.html"), media_type="text/html")
