#!/usr/bin/env python3
"""
Test the Pydantic model validation
"""

from pydantic import BaseModel, field_validator, ValidationError
from pydantic.networks import EmailStr

class UserBase(BaseModel):
    email: EmailStr

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

def test_validation():
    print("Testing Pydantic model validation...")
    
    # Test with a short password
    try:
        user_short = UserCreate(email="test@example.com", password="short")
        print(f"Short password validated successfully: {user_short.password}")
    except ValidationError as e:
        print(f"Validation error for short password: {e}")
    
    # Test with a long password
    long_password = "a" * 80  # 80 bytes
    try:
        user_long = UserCreate(email="test@example.com", password=long_password)
        print(f"Long password validated successfully: {user_long.password}")
    except ValidationError as e:
        print(f"Validation error for long password: {e}")
    except ValueError as e:
        print(f"Value error for long password: {e}")

if __name__ == "__main__":
    test_validation()