from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "CHANGE_THIS_SECRET_KEY"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    ALGORITHM: str = "HS256"
    API_PREFIX: str = "/api"
    CORS_ORIGINS: str = "*"

    # Email settings
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""

    # Upload settings
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_database_url(cls, value: str) -> str:
        if value and value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql://", 1)
        return value

    @property
    def cors_origins_list(self) -> list[str]:
        if self.CORS_ORIGINS.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = BASE_DIR / ".env"
        env_file_encoding = "utf-8"


settings = Settings()
