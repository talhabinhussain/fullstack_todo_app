from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Optional
from ..utils.jwt import verify_token, InvalidTokenException, ExpiredTokenException, MalformedTokenException
import uuid

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """
    Extract and verify JWT token from Authorization header,
    decode user data, and return user information.

    Args:
        credentials: HTTP Authorization credentials

    Returns:
        Dict containing user information (user_id, email, etc.)

    Raises:
        HTTPException: If token is missing, invalid, expired, or malformed
    """
    token = credentials.credentials

    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user_id exists in the payload
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Validate user_id is a valid UUID
    try:
        uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Return user information from token
    user_info = {
        "user_id": user_id,
        "email": payload.get("email", ""),
        "expires_at": payload.get("exp", "")
    }

    return user_info

def authorize_user_for_resource(current_user: Dict = Depends(get_current_user), user_id_from_path: str = None) -> Dict:
    """
    Compare the user_id in the JWT with the user_id in the URL path.
    This enforces that users can only access resources belonging to them.

    Args:
        current_user: User information extracted from JWT
        user_id_from_path: User ID from the request path parameter

    Returns:
        Dict containing user information if authorized

    Raises:
        HTTPException: If user is not authorized to access the resource
    """
    if user_id_from_path is None:
        return current_user

    # Verify that the authenticated user matches the user_id in the path
    if current_user["user_id"] != user_id_from_path:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )

    return current_user


def require_current_user(current_user: Dict = Depends(get_current_user)) -> Dict:
    """
    Require that a valid current user is authenticated.

    Args:
        current_user: User information extracted from JWT (via dependency)

    Returns:
        Dict containing user information

    Raises:
        HTTPException: If no valid user is authenticated
    """
    return current_user