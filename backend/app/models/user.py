from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid
from pydantic import EmailStr, field_validator


class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, nullable=False, max_length=255)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password_not_empty(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError("Password cannot be empty")
        
        # Check for bcrypt 72-byte password length limit
        if len(v.encode('utf-8')) > 72:
            raise ValueError("Password cannot be longer than 72 bytes. Please use a shorter password.")
        
        return v


class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class UserLogin(SQLModel):
    email: EmailStr
    password: str
