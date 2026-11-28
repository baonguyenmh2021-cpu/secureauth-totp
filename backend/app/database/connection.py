
from sqlalchemy import create_engine, text

from app.core.config import settings


# Initialize SQLAlchemy Engine
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    echo=False,
)


def check_database_connection() -> bool:
    """Check whether PostgreSQL is reachable."""

    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return result.scalar() == 1
