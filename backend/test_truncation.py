#!/usr/bin/env python3
"""
Test the actual functions from jwt.py to see if they work correctly
"""

from passlib.context import CryptContext

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
    print(f"Original password length: {len(password.encode('utf-8'))} bytes")
    print(f"Truncated password length: {len(password.encode('utf-8'))} bytes")
    return pwd_context.hash(password)

def test_truncation():
    print("Testing password truncation...")
    
    # Test with a password longer than 72 bytes
    long_password = "This is a very long password that exceeds the 72-byte limit imposed by bcrypt. It contains many characters to test the truncation functionality."
    print(f"Original password: {long_password}")
    print(f"Original password length: {len(long_password.encode('utf-8'))} bytes")
    
    try:
        truncated = _truncate_password_safely(long_password)
        print(f"Truncated password: {truncated}")
        print(f"Truncated password length: {len(truncated.encode('utf-8'))} bytes")
        
        # Now hash the truncated password
        hashed = get_password_hash(long_password)
        print(f"Successfully hashed: {hashed[:30]}...")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_truncation()