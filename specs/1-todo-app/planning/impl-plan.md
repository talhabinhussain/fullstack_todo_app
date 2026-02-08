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

## 2. Technical Context

- **Frontend Framework**: Next.js 16+ with App Router
- **Backend Framework**: Python FastAPI
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel
- **UI Library**: ShadCN UI with default theme
- **Package Manager**: UV for Python dependencies
- **Authentication**: JWT-based with Better Auth
- **Styling**: Tailwind CSS

### Unknowns (NEEDS CLARIFICATION)
- **Neon Database Connection Details**: Specific connection string format and environment variables needed
- **Better Auth Configuration**: Exact setup and integration steps for Next.js/FastAPI
- **Deployment Strategy**: Specific deployment configuration for the full-stack application

---

## 3. Constitution Check

Based on the project constitution, this plan validates:

✅ **Separation of Concerns**: Frontend/Backend/Data layers clearly separated
✅ **Security First**: Authentication & Authorization explicitly designed
✅ **Data Integrity**: Relational database with foreign key constraints
✅ **Error Handling**: Planned error handling and validation
✅ **Maintainability**: Clear architecture and technology choices
✅ **Responsive UI**: Following frontend principles with ShadCN UI
✅ **RESTful APIs**: Backend exposing RESTful endpoints as required
✅ **Data Isolation**: User data access restricted by authentication

---

## 4. Gates & Compliance Check

### Gate 1: Architecture Alignment
- [x] Client-server architecture confirmed
- [x] Clear separation between frontend and backend
- [x] Database layer properly abstracted

### Gate 2: Security Compliance
- [x] JWT-based authentication planned
- [x] Authorization middleware design included
- [x] Secure credential handling addressed

### Gate 3: Technology Stack Alignment
- [x] Next.js with App Router selected (meets frontend principles)
- [x] FastAPI selected (meets backend principles)
- [x] SQLModel with PostgreSQL (meets data persistence rules)
- [x] ShadCN UI (meets frontend principles)

### Gate 4: Constitution Compliance
- [x] All constitution principles addressed
- [x] No violations identified

---

## 5. Technology Stack

### 5.1 Frontend
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

### 5.2 Backend
- Framework: **Python FastAPI**
- Package Manager: **UV** (for dependency management and virtual environment)
- API Style: RESTful APIs
- Data Validation: Pydantic (via SQLModel)
- Authentication Verification: JWT token verification
- Environment: UV-managed virtual environment

---

### 5.3 ORM & Database
- ORM: **SQLModel**
- Database: **Neon Serverless PostgreSQL**
- Persistence Strategy: Relational schema with foreign key constraints

---

### 5.4 Spec-Driven Development Tooling
- AI Assistant: **Claude Code**
- Spec Framework: **Spec-Kit Plus**
- Workflow Enforcement: Constitution → Specification → Plan → Tasks → Implementation

---

## 6. High-Level Architecture

The system follows a **client–server architecture**:

- Frontend (Next.js) acts as the client
- Backend (FastAPI) exposes RESTful APIs
- Database (PostgreSQL) stores persistent data
- Authentication service (Better Auth) manages identity and sessions

All communication between frontend and backend occurs via **HTTP APIs secured by JWT tokens**.

---

## 7. Authentication & Authorization Design

### 7.1 Authentication Flow

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

### 7.2 Authorization Rules

- Every API request must be associated with an authenticated user
- The `{user_id}` in the URL must match the user ID decoded from the JWT
- Requests attempting to access another user's data must be rejected
- All task queries must be filtered by authenticated user ID

---

## 8. API Design (Contract)

All API endpoints are protected and require authentication.

### 8.1 Task Endpoints

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/api/{user_id}/tasks` | List all tasks for a user |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{id}` | Retrieve task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle task completion |

---

### 8.2 API Behavior Rules

- All endpoints must return consistent JSON responses
- Appropriate HTTP status codes must be used
- Validation errors must be explicit
- Unauthorized or forbidden access must be rejected

---

## 9. Data Model Design

### 9.1 User Entity
- id (primary key)
- email
- created_at
- updated_at

### 9.2 Task Entity
- id (primary key)
- user_id (foreign key)
- title
- description (optional)
- is_completed
- created_at
- updated_at

---

## 10. Backend Implementation Strategy

### 10.1 Backend Structure
- Package management via **UV** (pyproject.toml configuration)
- API routers separated by responsibility
- Authentication middleware for token validation
- Business logic isolated from route handlers
- SQLModel models for schema definition
- Database session management via dependency injection
- Virtual environment managed by UV

---

### 10.2 Backend Development Order
1. UV project initialization (pyproject.toml setup)
2. Database connection setup (Neon PostgreSQL)
3. SQLModel schema definitions
4. Authentication verification logic
5. Authorization middleware
6. CRUD task endpoints
7. Error handling and response standardization

---

### 10.3 Backend Dependency Management
- All Python dependencies managed via UV
- Dependencies declared in pyproject.toml
- Lock file (uv.lock) for reproducible builds
- Virtual environment activation via UV commands

---

## 11. Frontend Implementation Strategy

### 11.1 Frontend Structure
- App Router for routing
- Auth-related pages (signup/signin)
- Task dashboard page
- Reusable UI components (all from ShadCN UI library)
- API service layer for backend communication

---

### 11.2 Frontend Design Guidelines
- **Exclusively use ShadCN UI components** for all UI elements
- Apply **default ShadCN theme** without customization
- Leverage Tailwind utility classes for layout and spacing adjustments
- Ensure all components maintain consistency with ShadCN's design system
- No custom component creation unless ShadCN equivalent unavailable

---

### 11.3 Frontend Responsibilities
- Manage authentication state
- Attach JWT token to API requests
- Display tasks and task states using ShadCN components (Card, Button, Input, etc.)
- Handle loading, error, and empty states with ShadCN feedback components
- Ensure responsive UI across devices (mobile-first approach with Tailwind breakpoints)

---

### 11.4 ShadCN Component Usage
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

## 12. Development Order

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

## 13. Deployment & Environment Strategy

- Environment variables must be used for secrets
- Database credentials must not be hard-coded
- Backend and frontend must support separate environments
- Production configuration must enforce security defaults
- UV lock file must be committed for reproducible deployments

---

## 14. Definition of Ready for Implementation

The system is ready for implementation when:
- Constitution is approved
- Specification is finalized
- Clarifications are resolved
- This plan is accepted without ambiguity
- UV is installed and configured
- ShadCN UI is initialized in the Next.js project

---

## 15. Phase 0: Research & Resolution of Unknowns

### Research Tasks Completed:

#### 1. Neon Database Connection Details
- **Decision**: Use standard PostgreSQL connection string format with Neon-specific environment variables
- **Rationale**: Neon is PostgreSQL-compatible, so standard connection patterns apply
- **Connection Format**: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`
- **Environment Variables**: `DATABASE_URL` for connection string, with SSL enforcement

#### 2. Better Auth Configuration
- **Decision**: Use Better Auth with Next.js App Router integration
- **Rationale**: Better Auth provides excellent Next.js 13+ App Router support with TypeScript
- **Setup**: Initialize in middleware for global auth protection, use client hooks for frontend access
- **Integration**: Server Actions for mutations, React Server Components for initial auth state

#### 3. Deployment Strategy
- **Decision**: Deploy frontend to Vercel and backend to Railway/Render with Neon DB
- **Rationale**: These platforms offer seamless Next.js and FastAPI deployment with environment management
- **Alternative**: Docker containerization for unified deployment if needed
- **Environment**: Separate .env files for dev/staging/prod with CI/CD pipeline

### All unknowns resolved and incorporated into the plan.

---

## 16. Post-Design Constitution Compliance Check

After completing the detailed design, this plan continues to comply with all constitution principles:

✅ **Separation of Concerns**: Frontend/Backend/Data layers remain clearly separated with well-defined interfaces
✅ **Security First**: Authentication & Authorization explicitly implemented with JWT and middleware
✅ **Data Integrity**: SQLModel with PostgreSQL enforces integrity with foreign key constraints
✅ **Error Handling**: API contracts define proper error responses and validation
✅ **Maintainability**: Clean architecture with Next.js, FastAPI, and SQLModel for readability
✅ **Responsive UI**: ShadCN UI components ensure responsive design across devices
✅ **RESTful APIs**: FastAPI implements proper RESTful endpoints as required
✅ **Data Isolation**: Authentication and authorization ensure users only access their own data
✅ **Testing Standards**: Technologies chosen support testability (Pydantic models, React testing)
✅ **Performance**: Server components and API optimization strategies planned

All constitution principles are satisfied by the detailed implementation plan.