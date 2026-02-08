'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useTasks } from '@/hooks/useTasks';

export default function TasksPage() {
  const {
    tasks,
    loading,
    error,
    createTask,
    toggleTaskCompletion,
    deleteTask
  } = useTasks();

  const [newTask, setNewTask] = useState({ title: '', description: '' });

  // Handle creating a new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      alert('Title is required');
      return;
    }

    await createTask(newTask.title, newTask.description);
    setNewTask({ title: '', description: '' });
  };

  return (
    <ProtectedRoute fallback={<div>Loading tasks...</div>}>
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>Manage your tasks efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {/* Add New Task Form */}
              <form onSubmit={handleCreateTask} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Add New Task</h3>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Task description (optional)"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>
                  <Button type="submit">Add Task</Button>
                </div>
              </form>

              {/* Tasks List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Tasks ({tasks.length})</h3>

                {loading ? (
                  <div className="text-center py-4">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No tasks yet. Add your first task above!
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className={`flex items-start p-4 rounded-lg border ${
                          task.is_completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center mr-3 mt-1">
                          <Checkbox
                            checked={task.is_completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            aria-label={`Toggle task completion for ${task.title}`}
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className={`font-medium ${task.is_completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className={`mt-1 text-sm ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                              {task.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(task.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleTaskCompletion(task.id)}
                          >
                            {task.is_completed ? 'Undo' : 'Complete'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}