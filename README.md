# Todo Full-Stack Web Application

A full-stack todo application with JWT-based authentication, built with Next.js 16+, FastAPI, Neon PostgreSQL, and ShadCN UI components.

## Features

- **JWT-based Authentication**: Secure authentication system with token-based authorization
- **User Isolation**: Each user has isolated data accessible only to them
- **Task Management**: Create, read, update, and delete tasks
- **Responsive UI**: Mobile-friendly interface built with ShadCN components
- **Secure API**: FastAPI backend with proper authentication and validation

## Tech Stack

- **Frontend**: Next.js 16+, React, TypeScript
- **Backend**: FastAPI, Python 3.11
- **Database**: Neon PostgreSQL (managed PostgreSQL)
- **UI Components**: ShadCN UI
- **Authentication**: Better Auth with JWT tokens
- **Styling**: Tailwind CSS
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Node.js 18+
- Python 3.11+
- Docker and Docker Compose
- PostgreSQL (or use Neon PostgreSQL)

## Installation & Setup

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fullstack_todo_app
   ```

2. Set up the backend:
   ```bash
   cd backend
   pip install uv
   uv pip install -r pyproject.toml
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Create environment files:
   ```bash
   # backend/.env
   DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
   SECRET_KEY=your-super-secret-key-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

   ```bash
   # frontend/.env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

5. Start the applications:
   ```bash
   # Terminal 1: Start backend
   cd backend
   uvicorn app.main:app --reload

   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

### Using Docker

1. Build and start the services:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Project Structure

```
fullstack_todo_app/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # Database connection
│   │   ├── models/          # SQLModel definitions
│   │   ├── routers/         # API routes
│   │   ├── middleware/      # Authentication middleware
│   │   └── utils/           # Utility functions
│   └── pyproject.toml       # Python dependencies
├── frontend/
│   ├── app/                 # Next.js app directory
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Shared libraries
│   ├── utils/               # Utility functions
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   └── next.config.js       # Next.js configuration
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get JWT token
- `POST /api/logout` - Logout and invalidate token

### User-Specific Task Management
- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task for a user
- `PUT /api/{user_id}/tasks/{task_id}` - Update a specific task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a specific task

## Security Features

- JWT token-based authentication
- User data isolation through authenticated endpoints
- Proper validation and sanitization
- Secure password hashing
- Rate limiting considerations
- HTTPS enforcement in production

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT signing
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

### Frontend
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for API calls

## Testing

Run frontend tests:
```bash
cd frontend
npm run test
```

Run backend tests:
```bash
cd backend
pytest
```

## Deployment

The application is designed for easy deployment using Docker containers. The docker-compose.yml file orchestrates all necessary services.

For production deployments:
1. Use environment variables for sensitive configuration
2. Implement SSL certificates
3. Set up a reverse proxy (nginx)
4. Configure proper logging and monitoring
5. Set up automated backups for the database

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.