---
id: "4"
title: "create-tasks"
stage: "tasks"
date_iso: "2026-01-27"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "todo-app"
branch: "1-todo-app"
user: "alvi tech"
command: "/sp.tasks"
labels: ["tasks", "todo-app", "planning", "implementation"]
links:
  spec: "../specs/1-todo-app/spec.md"
  plan: "../specs/1-todo-app/planning/impl-plan.md"
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - "specs/1-todo-app/tasks.md"
  - "history/prompts/todo-app/4-create-tasks.todo-app.prompt.md"
tests_yaml: |
  - "No automated tests for tasks generation"
outcome: "Successfully created comprehensive task breakdown for the Todo Full-Stack Web Application with 135+ specific implementation tasks organized in phases."
evaluation: "The task breakdown follows the checklist format with proper IDs, story labels, and file paths. Tasks are organized by phase with clear dependencies and parallel execution opportunities identified. All requirements from the implementation plan have been converted to specific, actionable tasks."
---

# Create Tasks for Todo App

## User Prompt
```
# ✅ Task Breakdown

## Todo Full-Stack Web Application (JWT-Based Stateless Auth)

---

## Phase 0 — Foundation & Alignment

### T0.1 Validate Specifications & Plan

- Review constitution, specification, and implementation plan for consistency
- Ensure JWT-based stateless authentication is the agreed strategy
- Confirm that frontend and backend are fully decoupled services
- Lock API contract and authentication flow
- Verify all stakeholders have approved the technical approach

---

### T0.2 Development Environment Setup

- Install and configure **UV** for Python package management
- Initialize Next.js 16+ project with App Router
- Install and configure **ShadCN UI** with default theme
- Configure Tailwind CSS as styling foundation
- Set up Neon PostgreSQL database instance
- Create environment variable templates (.env.example)

---

## Phase 1 — Backend Foundation (FastAPI + UV)

### T1.1 Initialize FastAPI Project with UV

- Create pyproject.toml with project metadata
- Add FastAPI, SQLModel, and required dependencies via UV
- Set up virtual environment using UV
- Configure project structure:
  - `/app` - main application code
  - `/app/models` - SQLModel schemas
  - `/app/routers` - API route handlers
  - `/app/middleware` - authentication middleware
  - `/app/utils` - utility functions (JWT verification)
  - `/app/database.py` - database connection
- Create main.py with FastAPI app initialization

---

### T1.2 Configure Database Connection (Neon PostgreSQL)

- Set up database connection string from environment variables
- Configure SQLModel engine with Neon PostgreSQL
- Implement connection pooling
- Create database initialization utility
- Validate database connectivity on startup
- Add health check endpoint

---

### T1.3 Design and Implement SQLModel Schemas

- Define `User` model:
  - id (UUID, primary key)
  - email (string, unique, indexed)
  - created_at (datetime)
  - updated_at (datetime)
- Define `Task` model:
  - id (UUID, primary key)
  - user_id (UUID, foreign key → User.id)
  - title (string, required)
  - description (string, optional)
  - is_completed (boolean, default=False)
  - created_at (datetime)
  - updated_at (datetime)
- Create database tables using SQLModel metadata

---

### T1.4 Implement Database Session Management

- Create dependency injection function for DB sessions
- Ensure one session per request lifecycle
- Implement automatic session cleanup after request
- Prevent shared global database sessions
- Add error handling for database connection failures

---

## Phase 2 — Authentication & Authorization (Backend)

### T2.1 Implement JWT Verification Logic

- Create JWT utility module in `/app/utils/jwt.py`
- Implement JWT token verification function:
  - Verify token signature using shared secret (from env)
  - Validate token expiration (`exp` claim)
  - Decode token payload to extract:
    - `user_id`
    - `email`
    - `iat` (issued at)
- Handle invalid, expired, or malformed tokens with specific error messages
- Create custom exception classes for auth errors

---

### T2.2 Create Authentication Middleware

- Build FastAPI dependency for JWT verification
- Extract JWT from `Authorization: Bearer <token>` header
- Validate and decode token using JWT utility
- Inject authenticated user data into request context
- Return 401 Unauthorized for:
  - Missing token
  - Invalid token
  - Expired token
- Ensure middleware is stateless (no session storage)

---

### T2.3 Implement Authorization Enforcement

- Create authorization dependency that:
  - Compares `{user_id}` in URL path with `user_id` from JWT
  - Returns 403 Forbidden if user IDs don't match
  - Validates user is authorized for the requested resource
- Apply authorization to all protected endpoints
- Test cross-user access prevention

---

### T2.4 Apply Query-Level User Isolation

- Modify all database queries to filter by authenticated user ID
- Ensure no cross-user data leakage in:
  - Task list retrieval
  - Single task retrieval
  - Task updates
  - Task deletion
  - Completion toggle
- Add database-level constraints where applicable
- Write tests to validate isolation

---

## Phase 3 — Task API Endpoints (Backend)

### T3.1 GET `/api/{user_id}/tasks` - List Tasks

- Apply authentication middleware
- Apply authorization (verify user_id match)
- Query tasks filtered by `user_id`
- Return empty array if no tasks exist
- Include proper HTTP status codes (200 OK)
- Return consistent JSON structure

---

### T3.2 POST `/api/{user_id}/tasks` - Create Task

- Apply authentication and authorization
- Validate request body using Pydantic models:
  - title (required, non-empty)
  - description (optional)
- Create new task with:
  - Generated UUID
  - Authenticated user_id
  - is_completed = False
  - Current timestamps
- Persist to database
- Return created task (201 Created)

---

### T3.3 GET `/api/{user_id}/tasks/{id}` - Get Task Details

- Apply authentication and authorization
- Verify task exists
- Verify task belongs to authenticated user (user isolation)
- Return 404 Not Found if task doesn't exist
- Return 403 Forbidden if task belongs to different user
- Return task details (200 OK)

---

### T3.4 PUT `/api/{user_id}/tasks/{id}` - Update Task

- Apply authentication and authorization
- Verify task ownership
- Validate update payload:
  - title (optional)
  - description (optional)
  - is_completed (optional)
- Prevent modification of:
  - id
  - user_id
  - created_at
- Update updated_at timestamp
- Persist changes
- Return updated task (200 OK)

---

### T3.5 DELETE `/api/{user_id}/tasks/{id}` - Delete Task

- Apply authentication and authorization
- Verify task ownership
- Delete task from database
- Return 204 No Content on success
- Return 404 if task doesn't exist
- Verify task no longer appears in list queries

---

### T3.6 PATCH `/api/{user_id}/tasks/{id}/complete` - Toggle Completion

- Apply authentication and authorization
- Verify task ownership
- Toggle `is_completed` field (True ↔ False)
- Update updated_at timestamp
- Persist change
- Return updated task (200 OK)

---

### T3.7 Standardize API Error Responses

- Create consistent error response format:
  ```json
  {
    "error": "Error type",
    "message": "Human-readable message",
    "details": {}
  }
  ```
- Implement error handlers for:
  - 400 Bad Request (validation errors)
  - 401 Unauthorized (authentication failures)
  - 403 Forbidden (authorization failures)
  - 404 Not Found (resource not found)
  - 500 Internal Server Error (unexpected errors)
- Add request validation error formatting

---

## Phase 4 — Frontend Authentication (Next.js + ShadCN UI)

### T4.1 Configure Better Auth

- Install and configure Better Auth in Next.js project
- Set up authentication providers (email/password)
- Configure JWT token generation with:
  - Payload: `user_id`, `email`, `iat`, `exp`
  - Expiry: 7 days
  - Signing secret: shared with backend (via env)
- Test token generation and validation

---

### T4.2 Build Auth Pages (ShadCN Components)

- **Signup Page** (`/signup`):
  - Use ShadCN Form components
  - Email and password inputs (ShadCN Input)
  - Submit button (ShadCN Button)
  - Error display (ShadCN Alert)
  - Link to login page
- **Login Page** (`/login`):
  - Use ShadCN Form components
  - Email and password inputs
  - Submit button
  - Error display
  - Link to signup page
- Implement form validation using React Hook Form
- Handle authentication state updates

---

### T4.3 Implement JWT Storage Strategy

- Store JWT in HTTP-only cookies (recommended) OR
- Store in secure client-side storage
- Ensure token is accessible for API requests
- Prevent token exposure to unauthorized code
- Implement token refresh logic (if applicable)

---

### T4.4 Create Authenticated API Client

- Build centralized API service module
- Automatically attach JWT to all requests:
  ```javascript
  headers: {
    'Authorization': `Bearer ${token}`
  }
  ```
- Handle unauthenticated requests (redirect to login)
- Implement retry logic for expired tokens
- Standardize request/response handling

---

### T4.5 Handle Token Expiry and Session Management

- Detect 401 Unauthorized responses
- Clear invalid/expired tokens
- Redirect to login page
- Display user-friendly session expiry message (ShadCN Toast)
- Preserve intended destination for post-login redirect

---

### T4.6 Implement Logout Functionality

- Create logout button (ShadCN Button)
- Clear stored JWT token
- Clear authentication state
- Redirect to login page
- Confirm user session is fully terminated

---

## Phase 5 — Task Management UI (Frontend + ShadCN)

### T5.1 Build Task Dashboard Layout

- Create protected route (`/dashboard`)
- Implement authentication guard (redirect if not logged in)
- Build responsive layout using Tailwind breakpoints
- Add navigation header with:
  - App title
  - User email/avatar
  - Logout button (ShadCN Button)
- Create main content area for task list

---

### T5.2 Implement Task List Display

- Fetch tasks from API on page load
- Display tasks using **ShadCN Card** components:
  - Task title
  - Task description (if present)
  - Completion checkbox (ShadCN Checkbox)
  - Edit button (ShadCN Button variant)
  - Delete button (ShadCN Button variant)
- Handle empty task list state:
  - Display empty state message
  - Show "Create Task" call-to-action
- Implement loading state with **ShadCN Skeleton** components

---

### T5.3 Build Create Task Form

- Use **ShadCN Dialog** for modal form
- Implement form fields using **ShadCN Form** components:
  - Title input (ShadCN Input, required)
  - Description textarea (ShadCN Textarea, optional)
  - Submit button (ShadCN Button)
  - Cancel button (ShadCN Button variant)
- Validate form inputs before submission
- Call POST `/api/{user_id}/tasks` endpoint
- Display success notification (ShadCN Toast)
- Update task list optimistically or refetch

---

### T5.4 Implement Task Edit Functionality

- Use **ShadCN Dialog** for edit modal
- Pre-populate form with existing task data
- Allow editing:
  - Title
  - Description
- Call PUT `/api/{user_id}/tasks/{id}` endpoint
- Update task list after successful edit
- Display success/error feedback (ShadCN Toast)

---

### T5.5 Implement Task Deletion

- Add delete button to each task card
- Show confirmation dialog (ShadCN AlertDialog):
  - Confirm deletion message
  - Cancel button
  - Delete button (destructive variant)
- Call DELETE `/api/{user_id}/tasks/{id}` endpoint
- Remove task from UI after successful deletion
- Display success notification (ShadCN Toast)

---

### T5.6 Implement Task Completion Toggle

- Use **ShadCN Checkbox** for completion state
- Toggle on checkbox click
- Call PATCH `/api/{user_id}/tasks/{id}/complete` endpoint
- Update UI immediately (optimistic update)
- Revert on API error with error message
- Visual indication of completed tasks (strikethrough, opacity)

---

### T5.7 Handle UI Error States

- **API Error State**:
  - Display error message using ShadCN Alert
  - Provide retry action
- **Authentication Error State**:
  - Redirect to login page
  - Display session expiry message
- **Network Error State**:
  - Show offline indicator
  - Queue actions for retry when online (optional)
- **Validation Error State**:
  - Display field-level errors on forms
  - Highlight invalid fields

---

### T5.8 Implement Loading and Optimistic UI

- Show **ShadCN Skeleton** components during:
  - Initial task list load
  - Task creation/update/deletion
- Implement optimistic updates for:
  - Task completion toggle
  - Task creation (add to list immediately)
- Revert optimistic updates on API failure

---

## Phase 6 — Integration & Testing

### T6.1 End-to-End Authentication Flow Testing

- Test complete auth flow:
  1. User signs up → JWT issued
  2. User logs in → JWT issued
  3. Token stored securely
  4. API requests include token
  5. Backend verifies token
  6. User-specific data returned
  7. Token expiry handled gracefully
- Validate user isolation (cannot access other users' tasks)

---

### T6.2 Task CRUD Operations Testing

- Test all task operations:
  - Create task → appears in list
  - Read task → correct data displayed
  - Update task → changes persisted
  - Delete task → removed from list
  - Toggle completion → state updates
- Verify authorization enforcement
- Test edge cases (empty descriptions, long titles, etc.)

---

### T6.3 Security Validation

- Verify backend is fully stateless (no session storage)
- Confirm JWT alone is sufficient for authentication
- Test token expiry enforcement
- Attempt cross-user data access (should fail)
- Validate all endpoints require authentication
- Test with invalid/expired/malformed tokens

---

### T6.4 UI/UX Testing

- Test responsive design on:
  - Mobile devices
  - Tablets
  - Desktop screens
- Verify ShadCN component rendering
- Test keyboard navigation
- Validate form submission flows
- Check loading states and transitions
- Verify error messages are user-friendly

---

## Phase 7 — Finalization & Deployment Preparation

### T7.1 Code Cleanup & Refactoring

- Remove unused imports and code
- Ensure consistent naming conventions
- Add code comments for complex logic
- Format code according to project standards (Black for Python, Prettier for JS)
- Remove debug/console statements

---

### T7.2 Environment Configuration

- Create comprehensive .env.example files for:
  - Backend (FastAPI)
  - Frontend (Next.js)
- Document all required environment variables:
  - Database connection string
  - JWT signing secret
  - Better Auth configuration
  - API URLs
- Ensure no secrets are committed to version control
- Validate environment variable loading

---

### T7.3 Documentation

- Create README.md with:
  - Project overview
  - Technology stack
  - Setup instructions
  - Environment variable guide
  - Development workflow
  - API documentation (endpoints, request/response formats)
- Document authentication flow
- Add troubleshooting guide

---

### T7.4 Definition of Done Validation

- ✅ JWT-based stateless authentication implemented
- ✅ User isolation enforced at database level
- ✅ Token expiry enforced and handled gracefully
- ✅ All CRUD operations working end-to-end
- ✅ ShadCN UI components used throughout frontend
- ✅ Default ShadCN theme applied consistently
- ✅ Responsive design validated
- ✅ Backend managed with UV package manager
- ✅ Frontend and backend independently deployable
- ✅ Security validation passed
- ✅ Error handling comprehensive
- ✅ Code quality standards met

---

## Success Criteria

The implementation is complete when:

1. Users can sign up, log in, and log out
2. Users can perform all task CRUD operations
3. User data is completely isolated
4. Authentication is stateless and JWT-based
5. UI is built entirely with ShadCN components using default theme
6. Application is responsive across all device sizes
7. Error states are handled gracefully
8. Code is clean, documented, and production-ready

---
```

## Assistant Response
Created comprehensive task breakdown for the Todo Full-Stack Web Application at `specs/1-todo-app/tasks.md` with 135+ specific implementation tasks organized in phases:

1. **Phase 1 - Setup**: Environment validation and setup tasks
2. **Phase 2 - Backend Foundation**: FastAPI project initialization and database setup
3. **Phase 3 - Authentication & Authorization**: JWT verification and middleware
4. **Phase 4 - Task API Endpoints**: All task-related API endpoints
5. **Phase 5 - Frontend Authentication**: Better Auth configuration and auth pages
6. **Phase 6 - Task Management UI**: Frontend task management features
7. **Phase 7 - Integration & Testing**: Testing and validation tasks
8. **Phase 8 - Finalization**: Code cleanup, documentation, and deployment prep

Each task follows the required checklist format with:
- Proper checkboxes (`- [ ]`)
- Sequential task IDs (T001, T002, etc.)
- Parallelization markers ([P]) where appropriate
- Clear descriptions with file paths
- Proper organization by phase and dependencies

The tasks include clear dependencies, parallel execution opportunities, and an implementation strategy focusing on MVP delivery. All requirements from the implementation plan have been converted to specific, actionable tasks that can be executed by an LLM without additional context.