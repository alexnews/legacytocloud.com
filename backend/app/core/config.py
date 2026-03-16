from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "LegacyToCloud"
    environment: str = "development"
    debug: bool = True
    api_port: int = 8003

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/legacytocloud"

    # Security
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:8003",
        "https://legacytocloud.com",
        "https://www.legacytocloud.com"
    ]

    # Pipeline
    alpha_vantage_api_key: str = ""
    pipeline_symbols: list[str] = ["AAPL", "MSFT", "JPM", "GS"]
    clickhouse_host: str = "localhost"
    clickhouse_port: int = 9000
    clickhouse_database: str = "pipeline"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
