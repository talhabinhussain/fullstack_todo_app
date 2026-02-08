#!/usr/bin/env python3
"""
Test the exact flow from the API to identify where the error occurs
"""

from passlib.context import CryptContext
from pydantic import BaseModel, field_validator, ValidationError
from pydantic.networks import EmailStr

# Replicate the exact setup from jwt.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _truncate_password_safely(password: str, max_bytes: int = 72) -> str:
    """
    Safely truncate password to max_bytes while respecting UTF-8 character boundaries.
    """
    password_bytes = password.encode("utf-8")
    if len(password_bytes) <= max_bytes:
        return password

    # Truncate to max_bytes
    truncated_bytes = password_bytes[:max_bytes]

    # Try to decode, and if there are encoding issues, decode with error handling
    try:
        return truncated_bytes.decode("utf-8")
    except UnicodeDecodeError:
        # If there's an issue decoding, use error handling to manage incomplete sequences
        return truncated_bytes.decode("utf-8", errors="ignore")

def get_password_hash(password: str) -> str:
    # Bcrypt has a 72-byte password length limit
    # Safely truncate by finding the last valid character within 72 bytes
    password = _truncate_password_safely(password)
    print(f"After truncation: {len(password.encode('utf-8'))} bytes")
    return pwd_context.hash(password)

# Replicate the exact setup from models/user.py
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

def test_api_flow():
    print("Testing the complete API flow...")
    
    # Step 1: Test Pydantic validation
    print("\nStep 1: Testing Pydantic validation")
    try:
        user_data = UserCreate(email="test@example.com", password="shortpassword")
        print(f"Pydantic validation passed: password length = {len(user_data.password.encode('utf-8'))} bytes")
    except ValidationError as e:
        print(f"Pydantic validation failed: {e}")
        return
    except ValueError as e:
        print(f"Pydantic validation failed with ValueError: {e}")
        return
    
    # Step 2: Test password hashing
    print(f"\nStep 2: Testing password hashing")
    try:
        hashed_password = get_password_hash(user_data.password)
        print(f"Password hashing succeeded: {hashed_password[:30]}...")
    except Exception as e:
        print(f"Password hashing failed: {e}")
        print(f"Error type: {type(e)}")

if __name__ == "__main__":
    test_api_flow()