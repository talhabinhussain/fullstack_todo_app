# Data Model Design
## Todo Full-Stack Web Application

## User Entity
- **id**: UUID (Primary Key, Unique, Not Null)
- **email**: String (Unique, Not Null, Validated as email format)
- **created_at**: DateTime (Not Null, Auto-generated)
- **updated_at**: DateTime (Not Null, Auto-generated, Updated on change)

## Task Entity
- **id**: UUID (Primary Key, Unique, Not Null)
- **user_id**: UUID (Foreign Key to User.id, Not Null)
- **title**: String (Not Null, Max 100 characters as per spec)
- **description**: String (Optional, Nullable)
- **is_completed**: Boolean (Not Null, Default False)
- **created_at**: DateTime (Not Null, Auto-generated)
- **updated_at**: DateTime (Not Null, Auto-generated, Updated on change)

## Relationships
- Task.user_id → User.id (Many-to-One relationship)
- One User can have many Tasks
- Tasks are cascade-deleted when User is deleted (based on authorization requirements)

## Validation Rules
- User.email must be a valid email format
- Task.title must be 1-100 characters
- Task.title cannot be empty or whitespace only
- Task.is_completed defaults to False on creation
- Both entities require created_at and updated_at timestamps

## Indexes
- User.email: Unique index for fast lookups and uniqueness enforcement
- Task.user_id: Index for efficient user-based queries
- Task.created_at: Index for chronological sorting