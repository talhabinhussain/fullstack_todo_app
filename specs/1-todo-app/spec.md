# 📘 Specification
## Todo Full-Stack Web Application

---

## 1. Overview

The Todo Full-Stack Web Application is a web-based system that allows authenticated users to manage personal todo tasks through a responsive frontend interface and a secure RESTful backend API.

The application must support user authentication, task management, and persistent storage while ensuring that users can only access their own data.

---

## 2. Functional Requirements

### 2.1 User Authentication

The system must support secure user authentication with the following capabilities:

- Users must be able to **sign up** with valid credentials
- Users must be able to **sign in** using existing credentials
- Authentication must create a user session and issue a **JWT token**
- Authenticated users must remain logged in until they explicitly sign out or the session expires

---

### 2.2 Authentication Flow (Required Behavior)

The authentication system must follow this exact logical flow:

1. The user logs in from the frontend interface
2. The authentication service creates a session and issues a **JWT token**
3. The frontend stores the JWT securely
4. For every protected API request:
   - The frontend must include the token in the request header as
     `Authorization: Bearer <token>`
5. The backend must:
   - Extract the token from the request header
   - Verify the token signature using a shared secret
   - Decode the token to obtain user identity information (e.g., user ID, email)
   - Validate that the authenticated user matches the user referenced in the request
6. Requests that fail authentication or authorization must be rejected

---

## 3. Todo Management Requirements

### 3.1 Create Todo

- Authenticated users must be able to create a new todo item
- Each todo must include:
  - A title
  - An optional description
  - A completion status
- Newly created todos must be associated with the authenticated user

---

### 3.2 Read Todos

- Authenticated users must be able to retrieve a list of their todos
- Users must be able to retrieve a single todo by its identifier
- The system must return **only the todos belonging to the authenticated user**
- Completed and incomplete todos must be distinguishable

---

### 3.3 Update Todo

- Authenticated users must be able to update:
  - Title
  - Description
  - Completion status
- Users must not be able to update todos belonging to other users
- Partial updates must be supported where applicable

---

### 3.4 Delete Todo

- Authenticated users must be able to delete their own todos
- Users must not be able to delete todos belonging to other users
- Deleted todos must no longer appear in query results

---

### 3.5 Mark Todo as Completed

- Users must be able to mark a todo as completed
- Users must be able to mark a completed todo as incomplete
- Completion state must be persisted in the database

---

## 4. RESTful API Requirements

- The backend must expose **RESTful API endpoints**
- Endpoints must follow standard HTTP methods:
  - `POST` for creation
  - `GET` for retrieval
  - `PUT` or `PATCH` for updates
  - `DELETE` for deletion
- API responses must be consistent and predictable
- All protected endpoints must require authentication
- Unauthorized or forbidden requests must return appropriate HTTP status codes

---

## 5. Authorization & Data Isolation

- Every todo must be linked to a specific authenticated user
- The backend must verify that:
  - The user ID extracted from the JWT matches the user ID referenced in the request
- The backend must filter all queries so that:
  - Users can only read, update, or delete their own todos
- Cross-user data access must be strictly prevented

---

## 6. Frontend Requirements

- The frontend must provide a **responsive user interface**
- Users must be able to:
  - Sign up and sign in
  - View their todo list
  - Create, edit, delete, and complete todos
- The UI must clearly indicate:
  - Loading states
  - Error states
  - Empty states
- User actions must update the UI in a timely and predictable manner

---

## 7. Data Persistence Requirements

- Todo data must be stored in a **Neon Serverless PostgreSQL database**
- Data must persist across sessions and browser reloads
- Each todo record must include:
  - A unique identifier
  - User identifier
  - Title
  - Description (optional)
  - Completion status
  - Timestamps where applicable

---

## 8. Error Handling Requirements

- The system must handle invalid input gracefully
- Authentication and authorization errors must be explicit and secure
- Client-facing errors must not expose sensitive internal details
- The system must return meaningful error messages for recoverable errors

---

## 9. Non-Functional Requirements

- The system must be secure by default
- The application must be performant for typical usage
- The architecture must allow future feature expansion
- The system must be maintainable and readable

---

## 10. Acceptance Criteria

The project is considered complete when:

- All five Todo features are fully implemented
- Authentication and authorization work as specified
- Users can only access their own data
- Data is persisted correctly in the database
- The frontend and backend communicate securely via REST APIs
- The application functions correctly end-to-end

---

## 11. Assumptions

- The application will use standard web technologies (HTML, CSS, JavaScript) for the frontend
- The backend will be built with a modern web framework supporting JWT authentication
- The Neon Serverless PostgreSQL database will be accessible via standard database drivers
- Users will access the application through modern web browsers
- Network connectivity is assumed to be available for the web-based application

## 12. Clarifications

### Session 2026-01-27

- Q: What password security requirements should be enforced? → A: Enforce strong passwords (minimum 8 characters, mixed case, numbers, symbols)
- Q: How long should JWT tokens be valid before requiring re-authentication? → A: 24 hours for access tokens with refresh tokens for extended sessions
- Q: How should the API handle excessive requests to prevent abuse? → A: 100 requests per hour per user/IP
- Q: What should be the maximum length for todo titles? → A: 100 characters maximum
- Q: Should the system allow multiple concurrent sessions per user? → A: Allow multiple concurrent sessions per user

## 13. Updated Functional Requirements

### 13.1 Enhanced User Authentication

The system must support secure user authentication with the following enhanced capabilities:

- Users must be able to **sign up** with valid credentials including strong passwords (minimum 8 characters, mixed case, numbers, symbols)
- Users must be able to **sign in** using existing credentials
- Authentication must create a user session and issue a **JWT token** with 24-hour expiration and refresh capability
- The system must allow multiple concurrent sessions per user
- Authenticated users must remain logged in until they explicitly sign out or the session expires

### 13.2 API Rate Limiting

- The system must implement rate limiting to prevent abuse
- API endpoints must limit requests to 100 per hour per user/IP address
- Exceeded rate limit requests must return HTTP 429 (Too Many Requests) status

### 13.3 Todo Data Validation

- Each todo title must be limited to 100 characters maximum
- The system must validate title length before storing in the database