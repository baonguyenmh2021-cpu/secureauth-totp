
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db


app = FastAPI(
    title=f"{settings.APP_NAME} API",
    description="Two-Factor Authentication System using TOTP",
    version=settings.APP_VERSION,
)


@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/api/health/db", tags=["System"])
def database_health_check(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1")).scalar_one()

        if result != 1:
            raise HTTPException(
                status_code=503,
                detail="Database unavailable",
            )

        return {
            "status": "ok",
            "database": "PostgreSQL",
            "connection": "connected",
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        ) from None
