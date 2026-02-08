from datetime import datetime, timedelta
from typing import Optional
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Bcrypt has a 72-byte password length limit
    # Safely truncate by finding the last valid character within 72 bytes
    plain_password = _truncate_password_safely(plain_password)
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    # Bcrypt has a 72-byte password length limit
    # Safely truncate by finding the last valid character within 72 bytes
    password = _truncate_password_safely(password)
    return pwd_context.hash(password)


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


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


class AuthException(Exception):
    def __init__(self, detail: str = "Authentication failed"):
        self.detail = detail
        super().__init__(self.detail)


class InvalidTokenException(AuthException):
    def __init__(self, detail: str = "Invalid token"):
        super().__init__(detail)


class ExpiredTokenException(AuthException):
    def __init__(self, detail: str = "Token has expired"):
        super().__init__(detail)


class MalformedTokenException(AuthException):
    def __init__(self, detail: str = "Malformed token"):
        super().__init__(detail)
