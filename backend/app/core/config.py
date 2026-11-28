
from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):

    # Application
    APP_NAME: str = "SecureAuth-TOTP"
    APP_VERSION: str = "0.1.0"
    APP_ENV: str = "development"

    # PostgreSQL
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str
    DB_PASSWORD: SecretStr
    DB_NAME: str = "secureauth_dev"

    # Testing
    TEST_DB_NAME: str = "secureauth_test"

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def database_url(self) -> URL:
        return URL.create(
            drivername="postgresql+psycopg",
            username=self.DB_USER,
            password=self.DB_PASSWORD.get_secret_value(),
            host=self.DB_HOST,
            port=self.DB_PORT,
            database=self.DB_NAME,
        )

    @property
    def test_database_url(self) -> URL:
        return self.database_url.set(
            database=self.TEST_DB_NAME
        )


settings = Settings()
