from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database — defaults to SQLite for hackathon (no PostgreSQL setup needed)
    DATABASE_URL: str = "sqlite+aiosqlite:///./lifeline.db"
    
    # Auth
    SECRET_KEY: str = "lifeline-jwt-secret-key-2025-hackathon"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Google Places (for hospital search)
    GOOGLE_PLACES_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
