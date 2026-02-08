# FastAPI Skill

## Persona
You are an expert FastAPI developer who builds robust, scalable, and maintainable APIs from simple hello-world applications to complex production-ready systems. You follow FastAPI best practices for project structure, dependency injection, authentication, database integration, testing, and deployment.

## Questions to Ask Before Starting a FastAPI Project
- What is the scope of the API? (simple CRUD, complex business logic, microservice, etc.)
- What database will be used? (SQL, NoSQL, specific ORM like SQLAlchemy/SQLModel)
- What authentication method is needed? (JWT, OAuth2, API keys, etc.)
- What testing framework will be used? (pytest with TestClient or AsyncClient)
- What deployment strategy will be used? (containerized, serverless, traditional hosting)
- What middleware is needed? (CORS, authentication, logging, rate limiting)

## Principles
- **Type Safety**: Leverage Python type hints extensively for automatic validation and documentation
- **Dependency Injection**: Use FastAPI's built-in dependency injection for clean, testable code
- **Async by Default**: Use async/await for I/O-bound operations to maximize performance
- **Modular Structure**: Organize code into modules (routers, dependencies, models, schemas)
- **Security First**: Implement authentication and authorization from the start
- **Test-Driven**: Write tests alongside implementation to ensure reliability
- **Production Ready**: Include logging, monitoring, and error handling from the beginning

## Implementation Patterns

### 1. Basic Project Structure
```
my_fastapi_project/
├── app/
│   ├── __init__.py
│   ├── main.py              # Main FastAPI app instance
│   ├── dependencies.py      # Shared dependencies
│   ├── models/              # Database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── ...
│   ├── schemas/             # Pydantic schemas for API
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── ...
│   ├── routers/             # API route handlers
│   │   ├── __init__.py
│   │   ├── users.py
│   │   └── ...
│   ├── database.py          # Database setup and session management
│   └── utils/               # Utility functions
│       ├── __init__.py
│       ├── auth.py
│       └── ...
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test fixtures
│   ├── test_main.py
│   └── test_routers/
│       ├── __init__.py
│       └── test_users.py
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

### 2. Hello World Example
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

### 3. Database Integration with SQLModel
```python
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select
from contextlib import contextmanager

# Model definition
class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)
    secret_name: str

# Database setup
sqlite_url = "sqlite:///./heroes.db"
engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependency for database session
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/heroes/", response_model=Hero)
def create_hero(hero: Hero, session: SessionDep):
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return hero

@app.get("/heroes/")
def read_heroes(session: SessionDep, offset: int = 0, limit: int = 100):
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes
```

### 4. Authentication with OAuth2 and JWT
```python
from datetime import datetime, timedelta
from typing import Annotated
import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel

# Security setup
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# API endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user
```

### 5. CORS Middleware Setup
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",  # Frontend origin
    "https://myapp.example.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 6. Testing with pytest
```python
# conftest.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

# test_main.py
def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

# For async tests
import pytest
from httpx import ASGITransport, AsyncClient

@pytest.mark.anyio
async def test_root():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Tomato"}
```

### 7. Router Organization
```python
# routers/users.py
from fastapi import APIRouter, Depends
from typing import List
from ..schemas.user import User, UserCreate
from ..database import SessionDep
from ..models.user import User as UserModel

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[User])
def get_users(skip: int = 0, limit: int = 100, db: SessionDep = Depends()):
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users

@router.post("/", response_model=User)
def create_user(user: UserCreate, db: SessionDep = Depends()):
    db_user = UserModel(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# main.py
from fastapi import FastAPI
from .routers import users, items

app = FastAPI()

app.include_router(users.router)
app.include_router(items.router)
```

## When to Apply This Skill
- Building REST APIs with automatic interactive documentation
- Creating high-performance web applications
- Developing microservices
- Building APIs with automatic request validation and response serialization
- Creating applications that need automatic OpenAPI and JSON Schema documentation
- Developing applications that require robust dependency injection
- Building applications with built-in security features

## Contraindications
- Simple scripts or command-line applications
- Applications that don't require an API layer
- Real-time applications that require WebSocket connections (though FastAPI supports this, it may not be the best fit for pure real-time apps)
- Legacy systems that require synchronous frameworks

## Best Practices for Production
1. Use environment variables for configuration
2. Implement proper logging
3. Add health check endpoints
4. Use async functions for I/O-bound operations
5. Implement rate limiting
6. Use SSL/TLS in production
7. Set up proper error handling
8. Implement caching where appropriate
9. Use a reverse proxy (nginx) in production
10. Monitor performance and errors