from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models.task import Task, TaskCreate, TaskUpdate, TaskResponse
from ..middleware.auth import authorize_user_for_resource, require_current_user
from datetime import datetime
import uuid

router = APIRouter(tags=["tasks"])


@router.get("/tasks", response_model=List[TaskResponse])
async def list_tasks(
    user_id: str,
    current_user: dict = Depends(require_current_user),
    db: Session = Depends(get_session),
):
    """
    List all tasks for the authenticated user.

    Args:
        user_id: User ID from the URL path
        current_user: Authenticated user data
        db: Database session

    Returns:
        List of tasks belonging to the user
    """
    # Verify authorization - user can only access their own tasks
    authorize_user_for_resource(current_user, user_id)

    # Query tasks filtered by user_id to ensure no cross-user data leakage
    statement = select(Task).where(Task.user_id == uuid.UUID(user_id))
    tasks = db.exec(statement).all()

    return tasks


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: str,
    task_data: TaskCreate,
    current_user: dict = Depends(require_current_user),
    db: Session = Depends(get_session),
):
    """
    Create a new task for the authenticated user.

    Args:
        user_id: User ID from the URL path
        task_data: Task creation data
        current_user: Authenticated user data
        db: Database session

    Returns:
        Created task with 201 status
    """
    # Verify authorization - user can only create tasks for themselves
    authorize_user_for_resource(current_user, user_id)

    # Verify that the user_id in the path matches the authenticated user
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user",
        )

    # Create new task with authenticated user_id and current timestamps
    task = Task(
        title=task_data.title,
        description=task_data.description,
        is_completed=False,  # Default to False as specified
        user_id=uuid.UUID(user_id),
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.get("/tasks/{id}", response_model=TaskResponse)
async def get_task(
    user_id: str,
    id: str,
    current_user: dict = Depends(require_current_user),
    db: Session = Depends(get_session),
):
    """
    Get details of a specific task.

    Args:
        user_id: User ID from the URL path
        id: Task ID
        current_user: Authenticated user data
        db: Database session

    Returns:
        Task details
    """
    # Verify authorization - user can only access their own tasks
    authorize_user_for_resource(current_user, user_id)

    try:
        task_id = uuid.UUID(id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format"
        )

    # Verify task exists and belongs to authenticated user
    statement = select(Task).where(
        Task.id == task_id, Task.user_id == uuid.UUID(user_id)
    )
    task = db.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    return task


@router.put("/tasks/{id}", response_model=TaskResponse)
async def update_task(
    user_id: str,
    id: str,
    task_data: TaskUpdate,
    current_user: dict = Depends(require_current_user),
    db: Session = Depends(get_session),
):
    """
    Update a specific task.

    Args:
        user_id: User ID from the URL path
        id: Task ID
        task_data: Task update data
        current_user: Authenticated user data
        db: Database session

    Returns:
        Updated task
    """
    # Verify authorization - user can only update their own tasks
    authorize_user_for_resource(current_user, user_id)

    try:
        task_id = uuid.UUID(id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format"
        )

    # Verify task exists and belongs to authenticated user
    statement = select(Task).where(
        Task.id == task_id, Task.user_id == uuid.UUID(user_id)
    )
    task = db.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    # Update allowed fields only (prevent modification of id, user_id, created_at)
    update_data = task_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(task, field) and field not in ["id", "user_id", "created_at"]:
            setattr(task, field, value)

    # Update updated_at timestamp
    task.updated_at = datetime.utcnow()

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.delete("/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: str,
    id: str,
    current_user: dict = Depends(require_current_user),
    db: Session = Depends(get_session),
):
    """
    Delete a specific task.

    Args:
        user_id: User ID from the URL path
        id: Task ID
        current_user: Authenticated user data
        db: Database session
    """
    # Verify authorization - user can only delete their own tasks
    authorize_user_for_resource(current_user, user_id)

    try:
        task_id = uuid.UUID(id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format"
        )

    # Verify task exists and belongs to authenticated user
    statement = select(Task).where(
        Task.id == task_id, Task.user_id == uuid.UUID(user_id)
    )
    task = db.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    # Delete the task
    db.delete(task)
    db.commit()

    # Return 204 No Content on success
    return


@router.patch("/tasks/{id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    user_id: str,
    id: str,
    current_user: dict = Depends(require_current_user),
    db: Session = Depends(get_session),
):
    """
    Toggle the completion status of a specific task.

    Args:
        user_id: User ID from the URL path
        id: Task ID
        current_user: Authenticated user data
        db: Database session

    Returns:
        Updated task with toggled completion status
    """
    # Verify authorization - user can only toggle completion for their own tasks
    authorize_user_for_resource(current_user, user_id)

    try:
        task_id = uuid.UUID(id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format"
        )

    # Verify task exists and belongs to authenticated user
    statement = select(Task).where(
        Task.id == task_id, Task.user_id == uuid.UUID(user_id)
    )
    task = db.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    # Toggle the completion status
    task.is_completed = not task.is_completed
    task.updated_at = datetime.utcnow()

    db.add(task)
    db.commit()
    db.refresh(task)

    return task
