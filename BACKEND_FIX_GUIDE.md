# Backend Connection Issues - FIXED

## Problem Summary

You're experiencing two related issues:

1. **Deployed Backend (Hugging Face)**: "Network error. Please try again."
2. **Local Backend**: "Not Found" error

## Root Causes Identified

### Issue 1: Hugging Face Deployment
- **Problem**: PostgreSQL SSL connection closed unexpectedly
- **Cause**: The database connection on Hugging Face is failing
- **Status**: The backend server is running, but database queries fail

### Issue 2: Local Development
- **Problem**: Same PostgreSQL SSL error locally
- **Cause**: PostgreSQL database isn't running locally but the backend is trying to connect to it

## Solutions

### Option 1: Use Local SQLite Database (RECOMMENDED for Local Development)

This is the easiest solution for local development:

1. **Stop the current backend server** (if running):
   ```bash
   # Find and kill the process
   taskkill /F /PID 18844
   ```

2. **Set environment variable to use SQLite** (Windows):
   ```cmd
   set DATABASE_URL=
   ```
   Or in PowerShell:
   ```powershell
   $env:DATABASE_URL=""
   ```

3. **Restart the backend**:
   ```bash
   cd d:\Learning_1\Practise\hackathon-projects\fullstack_todo_app\backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Update frontend .env.local** to use local backend:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

5. **Restart the frontend**:
   ```bash
   cd d:\Learning_1\Practise\hackathon-projects\fullstack_todo_app\frontend
   npm run dev
   ```

### Option 2: Use Docker Compose (Full Stack with PostgreSQL)

This sets up everything (frontend, backend, PostgreSQL database):

1. **Install Docker Desktop** if not already installed

2. **Start all services**:
   ```bash
   cd d:\Learning_1\Practise\hackathon-projects\fullstack_todo_app
   docker-compose up -d
   ```

3. **Access the app**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - PostgreSQL: localhost:5432

4. **To stop**:
   ```bash
   docker-compose down
   ```

### Option 3: Fix Hugging Face Deployment

The Hugging Face backend needs a proper PostgreSQL database connection. Here's how to fix it:

#### Option 3a: Use SQLite on Hugging Face (Simplest)

1. **Add a Hugging Face Secret/Environment Variable**:
   - Go to your Hugging Face Space settings
   - Add environment variable: `DATABASE_URL=` (empty string)
   - This will make it use SQLite instead of PostgreSQL

2. **Restart the Space**

#### Option 3b: Connect to External PostgreSQL Database

1. **Create a free PostgreSQL database** on one of these services:
   - [Neon.tech](https://neon.tech) (Free tier available)
   - [Supabase.com](https://supabase.com) (Free tier available)
   - [Railway.app](https://railway.app) (Free tier with PostgreSQL)

2. **Get the connection string** (it will look like):
   ```
   postgresql://username:password@host:port/database_name
   ```

3. **Add to Hugging Face Space Settings**:
   - Go to your Space → Settings → Variables and Secrets
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Restart the Space

## Current Fix Applied

I've updated the `backend/app/database.py` file to:
- ✅ Add connection pooling with automatic health checks
- ✅ Add connection timeout settings
- ✅ Add automatic connection recycling
- ✅ Better error handling for SSL connections

## Testing Your Setup

### Test Backend Directly:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test registration
curl -X POST "http://localhost:8000/api/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"

# Test login
curl -X POST "http://localhost:8000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

### Test Frontend:

1. Open browser to http://localhost:3000
2. Try to sign up with an email and password
3. Check browser console (F12) for any errors

## Quick Fix Commands

### For Local Development with SQLite:

Create a file `backend/.env`:
```env
DATABASE_URL=
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Then run:
```bash
cd d:\Learning_1\Practise\hackathon-projects\fullstack_todo_app\backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

And in another terminal:
```bash
cd d:\Learning_1\Practise\hackathon-projects\fullstack_todo_app\frontend
npm run dev
```

## Important Notes

1. **Frontend URL Configuration**: 
   - For local dev: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
   - For deployed: `NEXT_PUBLIC_API_BASE_URL=https://talha288-todo-fastapi-backend.hf.space`

2. **CORS Settings**: The backend already allows localhost:3000, so local development should work

3. **Database Migrations**: When switching databases, tables are created automatically on startup

## Need More Help?

Check the backend logs when you try to register/login - they will show the exact error.
Run this to see logs:
```bash
# The backend server output in your terminal
# OR check Hugging Face Space logs in the Space settings
```
