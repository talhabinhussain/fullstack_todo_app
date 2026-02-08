import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TasksPage from '../app/tasks/page';

// Mock the better-auth-react hooks
vi.mock('better-auth-react', () => ({
  useAuth: () => ({
    session: {
      user: { id: 'test-user-id', email: 'test@example.com' },
    },
  }),
}));

// Mock the useTasks hook
vi.mock('../hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [
      {
        id: '1',
        user_id: 'test-user-id',
        title: 'Test Task',
        description: 'Test Description',
        is_completed: false,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ],
    loading: false,
    error: null,
    fetchTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskCompletion: vi.fn(),
  }),
}));

describe('Task Management', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('renders tasks page with existing tasks', () => {
    render(<TasksPage />);

    expect(screen.getByText('Your Tasks')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('allows adding a new task', async () => {
    const mockCreateTask = vi.fn();
    vi.mock('../hooks/useTasks', () => ({
      useTasks: () => ({
        tasks: [],
        loading: false,
        error: null,
        fetchTasks: vi.fn(),
        createTask: mockCreateTask,
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        toggleTaskCompletion: vi.fn(),
      }),
    }));

    render(<TasksPage />);

    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Task description');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith('New Task', 'New Description');
    });
  });

  it('displays loading state', () => {
    vi.mock('../hooks/useTasks', () => ({
      useTasks: () => ({
        tasks: [],
        loading: true,
        error: null,
        fetchTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        toggleTaskCompletion: vi.fn(),
      }),
    }));

    render(<TasksPage />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    vi.mock('../hooks/useTasks', () => ({
      useTasks: () => ({
        tasks: [],
        loading: false,
        error: 'Failed to load tasks',
        fetchTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        toggleTaskCompletion: vi.fn(),
      }),
    }));

    render(<TasksPage />);
    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
  });

  it('allows toggling task completion', async () => {
    const mockToggleTaskCompletion = vi.fn();
    vi.mock('../hooks/useTasks', () => ({
      useTasks: () => ({
        tasks: [
          {
            id: '1',
            user_id: 'test-user-id',
            title: 'Test Task',
            description: 'Test Description',
            is_completed: false,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          },
        ],
        loading: false,
        error: null,
        fetchTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        toggleTaskCompletion: mockToggleTaskCompletion,
      }),
    }));

    render(<TasksPage />);

    const checkbox = screen.getByLabelText('Toggle task completion for Test Task');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockToggleTaskCompletion).toHaveBeenCalledWith('1');
    });
  });

  it('allows deleting a task', async () => {
    const mockDeleteTask = vi.fn();
    vi.mock('../hooks/useTasks', () => ({
      useTasks: () => ({
        tasks: [
          {
            id: '1',
            user_id: 'test-user-id',
            title: 'Test Task',
            description: 'Test Description',
            is_completed: false,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          },
        ],
        loading: false,
        error: null,
        fetchTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: mockDeleteTask,
        toggleTaskCompletion: vi.fn(),
      }),
    }));

    render(<TasksPage />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith('1');
    });
  });
});