from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from .routers import tasks, users
from .database import create_tables

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(title="Todo API", version="1.0.0")

# Add CORS middleware to allow frontend requests from local dev and deployed environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://fullstack-todo-app-orpin.vercel.app",  # Your actual deployed frontend
        "http://localhost:3001",  # Additional common ports for Next.js apps
        "http://localhost:3002",
        "https://*.vercel.app"  # Allow all Vercel deployments from the same project
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
