import os
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy.pool import NullPool
from sqlmodel import SQLModel, Session, create_engine

# Import models to ensure they're registered with SQLModel
from .models.user import User
from .models.task import Task

load_dotenv()


def _normalize_database_url() -> str:
    database_url = os.getenv("DATABASE_URL", "").strip()
    if not database_url:
        return "sqlite:///./todo_app.db"

    # SQLAlchemy + psycopg3 expects the explicit driver name.
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg://", 1)

    return database_url


def _build_engine():
    database_url = _normalize_database_url()
    echo_sql = os.getenv("ENVIRONMENT", "development") != "production"

    if database_url.startswith("postgresql+psycopg://"):
        # Neon on serverless platforms can close idle pooled connections.
        # NullPool opens a fresh connection per request and avoids stale SSL sessions.
        return create_engine(
            database_url,
            echo=echo_sql,
            connect_args={
                "sslmode": "require",
                "connect_timeout": 30,
                "keepalives": 1,
                "keepalives_idle": 30,
                "keepalives_interval": 10,
                "keepalives_count": 5,
            },
            poolclass=NullPool,
            pool_pre_ping=True,
        )

    return create_engine(database_url, echo=echo_sql)


engine = _build_engine()


def create_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
