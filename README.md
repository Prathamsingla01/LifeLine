# LifeLine FastAPI Backend

## Project structure

```
lifeline-fastapi/
├── main.py           # App entry point, CORS, router registration
├── config.py         # Environment settings (.env)
├── database.py       # Async SQLAlchemy engine + session
├── models.py         # SQLAlchemy ORM models
├── schemas.py        # Pydantic request/response schemas
├── auth_utils.py     # JWT creation, password hashing, current_user dep
├── schema.sql        # Raw PostgreSQL DDL with PostGIS
├── requirements.txt
└── routers/
    ├── auth.py          # POST /register, POST /login
    ├── emergencies.py   # POST /report-emergency, PATCH /emergencies/:id/status
    ├── hospitals.py     # GET /nearby-hospitals
    └── fundraisers.py   # POST/GET /fundraisers
```

## Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Create `.env` file
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/lifeline
SECRET_KEY=your-secret-key-here
GOOGLE_PLACES_API_KEY=your-google-api-key
```

### 3. Set up PostgreSQL with PostGIS
```bash
createdb lifeline
psql -d lifeline -f schema.sql
```

### 4. Run the server
```bash
uvicorn main:app --reload
```

### 5. Open interactive docs
Visit: http://localhost:8000/docs

## Key endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/v1/register | No | Create account + family group |
| POST | /api/v1/login | No | Get JWT token |
| POST | /api/v1/report-emergency | Yes | Log emergency event |
| PATCH | /api/v1/emergencies/:id/status | Yes | Update emergency status |
| GET | /api/v1/nearby-hospitals | No | Find hospitals by lat/lng |
| POST | /api/v1/fundraisers | Yes | Create fundraiser |
| GET | /api/v1/fundraisers | No | List all fundraisers |

## Next steps
- Add Alembic for database migrations: `alembic init alembic`
- Add WebSocket endpoint for real-time family alerts
- Add S3 file upload endpoint for fundraiser documents
- Add rate limiting with `slowapi`
- Add admin endpoints for verifying fundraisers
