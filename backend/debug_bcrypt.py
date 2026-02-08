#!/usr/bin/env python3
"""
Debug script to test bcrypt functionality
"""

from passlib.context import CryptContext

# Initialize the password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test_password_hashing():
    print("Testing bcrypt password hashing...")
    
    # Test with a short password
    short_password = "short"
    print(f"Testing with short password: '{short_password}'")
    
    try:
        hashed = pwd_context.hash(short_password)
        print(f"Hashed successfully: {hashed[:30]}...")
    except Exception as e:
        print(f"Error hashing short password: {e}")
    
    # Test with a long password (>72 bytes)
    long_password = "a" * 80  # 80 bytes
    print(f"\nTesting with long password (>72 bytes): {len(long_password.encode('utf-8'))} bytes")
    
    try:
        hashed = pwd_context.hash(long_password)
        print(f"Hashed successfully: {hashed[:30]}...")
    except Exception as e:
        print(f"Error hashing long password: {e}")

    # Test with a password exactly at 72 bytes
    exact_72_password = "a" * 72  # Exactly 72 bytes
    print(f"\nTesting with password at 72 bytes: {len(exact_72_password.encode('utf-8'))} bytes")
    
    try:
        hashed = pwd_context.hash(exact_72_password)
        print(f"Hashed successfully: {hashed[:30]}...")
    except Exception as e:
        print(f"Error hashing 72-byte password: {e}")

if __name__ == "__main__":
    test_password_hashing()