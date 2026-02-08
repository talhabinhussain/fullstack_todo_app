# Quickstart Guide
## Todo Full-Stack Web Application

## Prerequisites
- Node.js 18+ installed
- Python 3.9+ installed
- UV package manager installed (`pip install uv`)
- Access to Neon Serverless PostgreSQL database

## Setup Instructions

### 1. Clone and Initialize Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup (Python FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment with UV
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv pip install fastapi uvicorn sqlmodel pydantic python-jose[cryptography] passlib[bcrypt] python-multipart

# Set environment variables
cp .env.example .env
# Update .env with your Neon database URL and JWT secret
```

### 3. Frontend Setup (Next.js with ShadCN)
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Install ShadCN UI components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input checkbox form dialog toast skeleton alert

# Set environment variables
cp .env.example .env.local
# Update with your backend API URL
```

### 4. Database Setup
```bash
# Make sure your Neon database is created and connection string is configured
# Run database migrations (these will be implemented as part of the backend)
cd backend
# Activate your virtual environment first
uv run python -c "
from sqlmodel import SQLModel, create_engine
from app.models import User, Task  # These will be your model imports
engine = create_engine('YOUR_DATABASE_URL')
SQLModel.metadata.create_all(engine)
"
```

### 5. Running the Application

#### Backend (Development)
```bash
cd backend
# Activate virtual environment
source .venv/bin/activate
# Run the FastAPI server
uv run uvicorn app.main:app --reload --port 8000
```

#### Frontend (Development)
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend Docs: http://localhost:8000/docs

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
JWT_SECRET_KEY=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Project Structure
```
todo-fullstack-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application
│   │   ├── models/          # SQLModel definitions
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── api/             # API routes
│   │   └── utils/           # Utility functions
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   └── .env.local           # Environment variables
└── README.md
```

## Development Commands

### Backend Commands
```bash
# Run tests
uv run pytest

# Format code
uv run black .

# Check types
uv run mypy .
```

### Frontend Commands
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm run test
```