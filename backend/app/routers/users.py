import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Dict
from ..database import get_session
from ..models.user import User, UserCreate, UserResponse, UserLogin
from ..utils.jwt import create_access_token, verify_password, get_password_hash
from datetime import timedelta
from uuid import UUID
import uuid

logger = logging.getLogger(__name__)

router = APIRouter(tags=["users"])


@router.post("/auth/register")
async def register_user(
    user_data: UserCreate, db: Session = Depends(get_session)
) -> Dict[str, str]:
    """
    Register a new user account.

    Args:
        user_data: User registration data (email, password)
        db: Database session

    Returns:
        JWT access token
    """
    try:
        logger.info(f"Attempting to register user with email: {user_data.email}")
        
        # Check if user already exists
        existing_user = db.exec(
            select(User).where(User.email == user_data.email)
        ).first()
        if existing_user:
            logger.warning(f"Registration attempt for existing email: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
            )

        # Hash the password - this is where bcrypt errors would occur
        try:
            hashed_password = get_password_hash(user_data.password)
        except ValueError as e:
            logger.error(f"Password hashing error for {user_data.email}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid password: {str(e)}",
            )
        except Exception as e:
            error_str = str(e)
            logger.error(f"Unexpected password hashing error for {user_data.email}: {error_str}")
            # Handle bcrypt-specific errors like the 72-byte limit
            if "password cannot be longer than 72 bytes" in error_str or "72 byte" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password exceeds maximum length of 72 bytes. Please use a shorter password.",
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid password: {error_str}",
                )

        # Create new user
        user = User(email=user_data.email, hashed_password=hashed_password)

        db.add(user)
        db.commit()
        db.refresh(user)

        logger.info(f"User created successfully with ID: {user.id}")

        # Create JWT token with user data
        access_token_expires = timedelta(minutes=1440)  # 24 hours
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=access_token_expires,
        )

        logger.info(f"Returning access token for user ID: {user.id}")
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as e:
        logger.error(f"HTTP Exception in registration: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected exception in registration: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}",
        )


@router.post("/auth/login")
async def login_user(
    user_credentials: UserLogin, db: Session = Depends(get_session)
) -> Dict[str, str]:
    """
    Authenticate user and return JWT token.

    Args:
        user_credentials: User login credentials (email, password)
        db: Database session

    Returns:
        JWT access token
    """
    logger.info(f"Login attempt for email: {user_credentials.email}")
    
    # Find user by email
    user = db.exec(select(User).where(User.email == user_credentials.email)).first()

    if not user or not verify_password(user_credentials.password, user.hashed_password):
        logger.warning(f"Failed login attempt for email: {user_credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    logger.info(f"Successful login for user ID: {user.id}")

    # Create JWT token with user data
    access_token_expires = timedelta(minutes=1440)  # 24 hours as per spec
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires,
    )

    logger.info(f"Returning access token for user ID: {user.id}")
    return {"access_token": access_token, "token_type": "bearer"}
