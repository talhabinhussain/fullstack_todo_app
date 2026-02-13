import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContextProvider';
import { taskApi } from '@/lib/api-client';
import { TokenManager } from '@/utils/token-manager';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  priority?: "low" | "medium" | "high";
  due_date?: string;
}

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (title: string, description?: string, priority?: "low" | "medium" | "high", due_date?: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  const fetchTasks = async () => {
    if (!userId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.error('Invalid user ID format:', userId);
      setError('Invalid user ID format');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the token from the auth context or TokenManager
      const authToken = token || TokenManager.getAccessToken();
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      // Call the backend API
      const response = await taskApi.getTasks(userId);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (title: string, description?: string, priority?: "low" | "medium" | "high", due_date?: string) => {
    console.log('Creating task with userId:', userId); // Debug log
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.error('Invalid user ID format:', userId);
      setError('Invalid user ID format');
      return;
    }

    try {
      setError(null);

      // Get the token from the auth context or TokenManager
      const authToken = token || TokenManager.getAccessToken();
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      console.log('Calling taskApi.createTask with userId:', userId); // Debug log
      // Call the backend API with additional parameters
      const response = await taskApi.createTask(userId, { title, description, priority, due_date });
      console.log('Task created successfully:', response.data); // Debug log
      setTasks(prev => [response.data, ...prev]);
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.error('Invalid user ID format:', userId);
      setError('Invalid user ID format');
      return;
    }

    try {
      setError(null);

      // Get the token from the auth context or TokenManager
      const authToken = token || TokenManager.getAccessToken();
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      // Call the backend API
      const response = await taskApi.updateTask(userId, id, updates);
      setTasks(prev => prev.map(task => task.id === id ? response.data : task));
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.error('Invalid user ID format:', userId);
      setError('Invalid user ID format');
      return;
    }

    try {
      setError(null);

      // Get the token from the auth context or TokenManager
      const authToken = token || TokenManager.getAccessToken();
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      // Call the backend API
      await taskApi.deleteTask(userId, id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { is_completed: !task.is_completed });
    }
  };

  // Refresh tasks when userId changes
  useEffect(() => {
    if (userId) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [userId]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};