---
id: "3"
title: "create-impl-plan"
stage: "plan"
date_iso: "2026-01-27"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "todo-app"
branch: "1-todo-app"
user: "alvi tech"
command: "/sp.plan"
labels: ["plan", "todo-app", "architecture", "design"]
links:
  spec: "../specs/1-todo-app/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - "specs/1-todo-app/planning/impl-plan.md"
  - "specs/1-todo-app/planning/data-model.md"
  - "specs/1-todo-app/planning/contracts/openapi.yaml"
  - "specs/1-todo-app/planning/quickstart.md"
  - "history/prompts/todo-app/3-create-impl-plan.todo-app.prompt.md"
tests_yaml: |
  - "No automated tests for planning phase"
outcome: "Successfully created comprehensive implementation plan with data model, API contracts, and quickstart guide for the Todo Full-Stack Web Application."
evaluation: "The implementation plan fully aligns with the specification and constitution, including detailed technology stack, architecture, authentication design, and development order. All unknowns have been researched and resolved."
---

# Create Implementation Plan for Todo App

## User Prompt
```
# 🛠️ Implementation Plan
## Todo Full-Stack Web Application

---

## 1. Objective of This Plan

This plan defines **how** the Todo Full-Stack Web Application will be implemented based on the approved constitution and specification.

It establishes:
- Technology stack choices
- System architecture
- Authentication and authorization flow
- API contract
- Data model design
- Development order and integration strategy

This plan acts as a **single source of truth** for implementation.

---

## 2. Technology Stack

### 2.1 Frontend
- Framework: **Next.js 16+**
- Routing: **App Router**
- Rendering: Server Components with Client Components where required
- UI Components: **ShadCN UI** (with default theme)
- Styling: **Tailwind CSS** (utility-first styling foundation for ShadCN)
- Design System: All components must use ShadCN UI library components with default theme configuration
- Theme: Default ShadCN theme (no custom theming required)
- API Communication: Fetch API
- Authentication Handling: JWT-based session handling via Better Auth

---

### 2.2 Backend
- Framework: **Python FastAPI**
- Package Manager: **UV** (for dependency management and virtual environment)
- API Style: RESTful APIs
- Data Validation: Pydantic (via SQLModel)
- Authentication Verification: JWT token verification
- Environment: UV-managed virtual environment

---

### 2.3 ORM & Database
- ORM: **SQLModel**
- Database: **Neon Serverless PostgreSQL**
- Persistence Strategy: Relational schema with foreign key constraints

---

### 2.4 Spec-Driven Development Tooling
- AI Assistant: **Claude Code**
- Spec Framework: **Spec-Kit Plus**
- Workflow Enforcement: Constitution → Specification → Plan → Tasks → Implementation

---

## 3. High-Level Architecture

The system follows a **client–server architecture**:

- Frontend (Next.js) acts as the client
- Backend (FastAPI) exposes RESTful APIs
- Database (PostgreSQL) stores persistent data
- Authentication service (Better Auth) manages identity and sessions

All communication between frontend and backend occurs via **HTTP APIs secured by JWT tokens**.

---

## 4. Authentication & Authorization Design

### 4.1 Authentication Flow

1. User signs up or signs in via the frontend
2. Better Auth creates a session and issues a **JWT token**
3. The frontend stores the JWT securely
4. For all protected API requests:
   - The frontend includes the token in the request header:
     ```
     Authorization: Bearer <token>
     ```
5. The backend:
   - Extracts the token from the header
   - Verifies the token signature using a shared secret
   - Decodes the token to retrieve user identity (user ID, email)
   - Validates authorization before processing the request

---

### 4.2 Authorization Rules

- Every API request must be associated with an authenticated user
- The `{user_id}` in the URL must match the user ID decoded from the JWT
- Requests attempting to access another user's data must be rejected
- All task queries must be filtered by authenticated user ID

---

## 5. API Design (Contract)

All API endpoints are protected and require authentication.

### 5.1 Task Endpoints

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/api/{user_id}/tasks` | List all tasks for a user |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{id}` | Retrieve task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle task completion |

---

### 5.2 API Behavior Rules

- All endpoints must return consistent JSON responses
- Appropriate HTTP status codes must be used
- Validation errors must be explicit
- Unauthorized or forbidden access must be rejected

---

## 6. Data Model Design

### 6.1 User Entity
- id (primary key)
- email
- created_at
- updated_at

### 6.2 Task Entity
- id (primary key)
- user_id (foreign key)
- title
- description (optional)
- is_completed
- created_at
- updated_at

---

## 7. Backend Implementation Strategy

### 7.1 Backend Structure
- Package management via **UV** (pyproject.toml configuration)
- API routers separated by responsibility
- Authentication middleware for token validation
- Business logic isolated from route handlers
- SQLModel models for schema definition
- Database session management via dependency injection
- Virtual environment managed by UV

---

### 7.2 Backend Development Order
1. UV project initialization (pyproject.toml setup)
2. Database connection setup (Neon PostgreSQL)
3. SQLModel schema definitions
4. Authentication verification logic
5. Authorization middleware
6. CRUD task endpoints
7. Error handling and response standardization

---

### 7.3 Backend Dependency Management
- All Python dependencies managed via UV
- Dependencies declared in pyproject.toml
- Lock file (uv.lock) for reproducible builds
- Virtual environment activation via UV commands

---

## 8. Frontend Implementation Strategy

### 8.1 Frontend Structure
- App Router for routing
- Auth-related pages (signup/signin)
- Task dashboard page
- Reusable UI components (all from ShadCN UI library)
- API service layer for backend communication

---

### 8.2 Frontend Design Guidelines
- **Exclusively use ShadCN UI components** for all UI elements
- Apply **default ShadCN theme** without customization
- Leverage Tailwind utility classes for layout and spacing adjustments
- Ensure all components maintain consistency with ShadCN's design system
- No custom component creation unless ShadCN equivalent unavailable

---

### 8.3 Frontend Responsibilities
- Manage authentication state
- Attach JWT token to API requests
- Display tasks and task states using ShadCN components (Card, Button, Input, etc.)
- Handle loading, error, and empty states with ShadCN feedback components
- Ensure responsive UI across devices (mobile-first approach with Tailwind breakpoints)

---

### 8.4 ShadCN Component Usage
The following ShadCN components should be used:
- **Button** - for all action triggers
- **Card** - for task display containers
- **Input** - for text entry fields
- **Checkbox** - for task completion toggle
- **Form** - for structured data entry
- **Dialog** - for modals and confirmations
- **Toast** - for success/error notifications
- **Skeleton** - for loading states
- **Alert** - for error messages

---

## 9. Development Order

Implementation must follow this sequence:

1. Backend UV project setup
2. Backend authentication and authorization
3. Backend task APIs
4. Backend data persistence
5. Frontend ShadCN UI setup and configuration
6. Frontend authentication UI (using ShadCN components)
7. Frontend task UI (using ShadCN components)
8. Frontend–backend integration
9. End-to-end testing

---

## 10. Deployment & Environment Strategy

- Environment variables must be used for secrets
- Database credentials must not be hard-coded
- Backend and frontend must support separate environments
- Production configuration must enforce security defaults
- UV lock file must be committed for reproducible deployments

---

## 11. Definition of Ready for Implementation

The system is ready for implementation when:
- Constitution is approved
- Specification is finalized
- Clarifications are resolved
- This plan is accepted without ambiguity
- UV is installed and configured
- ShadCN UI is initialized in the Next.js project

---
```

## Assistant Response
Created a comprehensive implementation plan for the Todo Full-Stack Web Application with:

1. **Detailed Implementation Plan** at `specs/1-todo-app/planning/impl-plan.md`:
   - Complete technical context with resolved unknowns
   - Constitution compliance checks
   - Detailed architecture and technology stack
   - Authentication and authorization design
   - API contracts and data models
   - Development order and deployment strategy

2. **Data Model Design** at `specs/1-todo-app/planning/data-model.md`:
   - User and Task entity definitions
   - Field specifications and validation rules
   - Relationships and indexes

3. **API Contracts** at `specs/1-todo-app/planning/contracts/openapi.yaml`:
   - Complete OpenAPI specification
   - All endpoints with request/response schemas
   - Security schemes and error responses

4. **Quickstart Guide** at `specs/1-todo-app/planning/quickstart.md`:
   - Setup instructions for backend and frontend
   - Environment configuration
   - Project structure and development commands

The implementation plan fully aligns with the specification and constitution, with all unknowns researched and resolved. The plan is ready for the next phase: creating implementation tasks.