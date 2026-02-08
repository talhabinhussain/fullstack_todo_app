from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
import os
from dotenv import load_dotenv

# Import models to ensure they're registered with SQLModel
from .models.user import User
from .models.task import Task

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

if "postgresql+psycopg" in DATABASE_URL:
    # psycopg3 driver with SSL
    engine = create_engine(DATABASE_URL, echo=True, connect_args={"sslmode": "require"})
elif DATABASE_URL.startswith("postgresql"):
    # Fallback for other PostgreSQL drivers
    engine = create_engine(DATABASE_URL, echo=True, connect_args={"sslmode": "require"})
else:
    engine = create_engine(DATABASE_URL, echo=True)


def create_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
