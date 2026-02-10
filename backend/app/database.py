from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
import os
from dotenv import load_dotenv

# Import models to ensure they're registered with SQLModel
from .models.user import User
from .models.task import Task

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")  # Get the environment variable

# If DATABASE_URL is not set or is empty, default to SQLite
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./todo_app.db"

if "postgresql+psycopg" in DATABASE_URL:
    # psycopg3 driver with SSL
    engine = create_engine(DATABASE_URL, echo=True, connect_args={"sslmode": "require"})
elif DATABASE_URL.startswith("postgresql"):
    # Convert standard PostgreSQL URLs to use psycopg3 driver
    # This handles cases where DATABASE_URL is like 'postgresql://...' instead of 'postgresql+psycopg://...'
    if not "postgresql+psycopg://" in DATABASE_URL:
        # Replace 'postgresql://' with 'postgresql+psycopg://' to ensure correct driver usage
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
    engine = create_engine(DATABASE_URL, echo=True, connect_args={"sslmode": "require"})
else:
    # For SQLite or other databases
    engine = create_engine(DATABASE_URL, echo=True)


def create_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
