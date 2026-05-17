from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

from .routers import tasks, users
from .database import create_tables

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(title="Todo API", version="1.0.0")

# Configure allowed origins based on environment
# Always allow localhost and common dev origins
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://*.vercel.app",  # Allow all Vercel deployments
    "https://*.railway.app",  # Allow Railway deployments if needed
    "https://vercel.app",  # Additional Vercel pattern
]

if os.getenv("ENVIRONMENT") == "production":
    # Production environment - allow specific origins
    FRONTEND_URL = os.getenv("FRONTEND_URL")
    if FRONTEND_URL:
        allowed_origins.append(FRONTEND_URL)

    # Also allow the specific deployed frontend URL if it's different
    DEPLOYED_FRONTEND_URL = os.getenv("DEPLOYED_FRONTEND_URL")
    if DEPLOYED_FRONTEND_URL:
        allowed_origins.append(DEPLOYED_FRONTEND_URL)

    # For debugging purposes, you can temporarily allow all origins in production
    DEBUG_ALLOW_ALL_ORIGINS = os.getenv("DEBUG_ALLOW_ALL_ORIGINS")
    if DEBUG_ALLOW_ALL_ORIGINS == "true":
        allowed_origins = ["*"]

# Add CORS middleware to allow frontend requests from local dev and deployed environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Allow credentials to be sent with cross-origin requests
    allow_origin_regex=None,  # Not using regex for now
    # Expose headers that frontend might need to access
    expose_headers=["Access-Control-Allow-Origin", "Content-Type", "Authorization"],
)

# Include the tasks router with user-specific prefix
app.include_router(tasks.router, prefix="/api/{user_id}")

# Include the users router for authentication endpoints
app.include_router(users.router, prefix="/api")


@app.on_event("startup")
def on_startup():
    """Create database tables on application startup."""
    create_tables()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Standardize API Error Responses (T127-T133)
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": [
                {"loc": error["loc"], "msg": error["msg"], "type": error["type"]}
                for error in exc.errors()
            ],
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {type(exc).__name__}: {str(exc)}", exc_info=exc)
    return JSONResponse(
        status_code=500, content={"detail": f"Internal server error: {str(exc)}"}
    )


# Add a route to check the current origin settings
@app.get("/debug/cors")
def debug_cors():
    return {
        "allowed_origins": [
            "https://*.vercel.app",  # Allow all Vercel deployments
            "https://vercel.app",  # Additional Vercel pattern
        ]
        + ([os.getenv("FRONTEND_URL")] if os.getenv("FRONTEND_URL") else [])
        + (
            [os.getenv("DEPLOYED_FRONTEND_URL")]
            if os.getenv("DEPLOYED_FRONTEND_URL")
            else []
        ),
        "environment": os.getenv("ENVIRONMENT"),
        "frontend_url_env": os.getenv("FRONTEND_URL"),
        "deployed_frontend_url_env": os.getenv("DEPLOYED_FRONTEND_URL"),
    }
