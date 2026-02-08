#!/usr/bin/env python3
"""
Test to replicate the exact error from the API
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

# Import the same functions used in the API
from app.utils.jwt import get_password_hash
from app.models.user import UserCreate

def test_exact_api_call():
    print("Testing exact scenario from API...")
    
    # Simulate the exact call that would happen in users.py
    try:
        # This mimics the Pydantic validation
        user_data = UserCreate(email="test@example.com", password="testpassword")
        print(f"Pydantic validation passed. Password: {user_data.password}, Length: {len(user_data.password.encode('utf-8'))} bytes")
        
        # This mimics the password hashing that happens in users.py
        print("Attempting to hash password...")
        hashed_password = get_password_hash(user_data.password)
        print(f"Password hashing succeeded: {hashed_password[:30]}...")
        
    except Exception as e:
        print(f"Error occurred: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_exact_api_call()