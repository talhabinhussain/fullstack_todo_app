"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/hooks/useTasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTasks } from "@/hooks/useTasks";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Circle,
  Calendar,
  Flag,
  ListTodo,
  CheckCheck,
  Clock,
  SortAsc,
} from "lucide-react";

type Priority = "low" | "medium" | "high";
type FilterType = "all" | "active" | "completed";
type SortType = "date" | "priority" | "title";

export default function TasksPage() {
  const {
    tasks,
    loading,
    error,
    createTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
  } = useTasks();

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    due_date: "",
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("date");

  // Filter and search tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply filter
    if (filter === "active") {
      filtered = filtered.filter((task) => !task.is_completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((task) => task.is_completed);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === "priority") {
        const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        const aPriority = (a.priority || "medium") as Priority;
        const bPriority = (b.priority || "medium") as Priority;
        return (
          priorityOrder[bPriority] -
          priorityOrder[aPriority]
        );
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return sorted;
  }, [tasks, filter, searchQuery, sortBy]);

  // Task statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.is_completed).length;
    const active = total - completed;
    const highPriority = tasks.filter(
      (t) => t.priority === "high" && !t.is_completed,
    ).length;

    return { total, completed, active, highPriority };
  }, [tasks]);

  // Handle creating a new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      alert("Title is required");
      return;
    }

    await createTask(newTask.title, newTask.description, newTask.priority, newTask.due_date || undefined);

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      due_date: "",
    });
  };

  // Handle editing a task
  const handleEditTask = async () => {
    if (!editingTask) return;

    await updateTask(editingTask.id, {
      title: editingTask.title,
      description: editingTask.description,
      priority: editingTask.priority,
      due_date: editingTask.due_date,
    });

    setEditDialogOpen(false);
    setEditingTask(null);
  };

  // Open edit dialog
  const openEditDialog = (task: Task) => {
    setEditingTask({ ...task });
    setEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (taskId: string) => {
    setTaskIdToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  // Handle task deletion
  const handleDeleteTask = async () => {
    if (taskIdToDelete) {
      await deleteTask(taskIdToDelete);
      setDeleteDialogOpen(false);
      setTaskIdToDelete(null);
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority?: Priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Check if task is overdue
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  return (
    <ProtectedRoute fallback={<div>Loading tasks...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Stats */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Task Manager
            </h1>
            <p className="text-gray-600 mb-6">
              Organize your work and life, finally.
            </p>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Tasks
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.total}
                      </p>
                    </div>
                    <ListTodo className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completed
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.completed}
                      </p>
                    </div>
                    <CheckCheck className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.active}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        High Priority
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.highPriority}
                      </p>
                    </div>
                    <Flag className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add New Task Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Task
                  </CardTitle>
                  <CardDescription>
                    Create a new task to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter task title..."
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({ ...newTask, title: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Add details about your task..."
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 min-h-[80px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: string) =>
                          setNewTask({ ...newTask, priority: value as Priority })
                        }
                      >
                        <SelectTrigger id="priority" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="due_date">Due Date</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={newTask.due_date}
                        onChange={(e) =>
                          setNewTask({ ...newTask, due_date: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Tasks List */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>Your Tasks</CardTitle>

                    {/* Search and Sort Controls */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search tasks..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 w-full sm:w-64"
                        />
                      </div>

                      <Select
                        value={sortBy}
                        onValueChange={(value: string) => setSortBy(value as SortType)}
                      >
                        <SelectTrigger className="w-full sm:w-40">
                          <SortAsc className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Sort by Date</SelectItem>
                          <SelectItem value="priority">
                            Sort by Priority
                          </SelectItem>
                          <SelectItem value="title">Sort by Title</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Filter Tabs */}
                  <Tabs
                    value={filter}
                    onValueChange={(value: string) => setFilter(value as FilterType)}
                    className="mb-6"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger
                        value="all"
                        className="flex items-center gap-2"
                      >
                        <ListTodo className="h-4 w-4" />
                        All ({tasks.length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="active"
                        className="flex items-center gap-2"
                      >
                        <Circle className="h-4 w-4" />
                        Active ({stats.active})
                      </TabsTrigger>
                      <TabsTrigger
                        value="completed"
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Completed ({stats.completed})
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Tasks List */}
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading tasks...</p>
                    </div>
                  ) : filteredAndSortedTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                        {filter === "completed" ? (
                          <CheckCircle2 className="h-full w-full" />
                        ) : (
                          <ListTodo className="h-full w-full" />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchQuery
                          ? "No tasks found"
                          : filter === "active"
                            ? "No active tasks"
                            : filter === "completed"
                              ? "No completed tasks yet"
                              : "No tasks yet"}
                      </h3>
                      <p className="text-gray-500">
                        {searchQuery
                          ? "Try adjusting your search terms"
                          : filter === "all"
                            ? "Create your first task to get started!"
                            : filter === "active"
                              ? "All tasks are completed!"
                              : "Complete some tasks to see them here"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredAndSortedTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`group relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                            task.is_completed
                              ? "bg-gray-50 border-gray-200"
                              : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Checkbox */}
                            <div className="flex items-center pt-1">
                              <Checkbox
                                checked={task.is_completed}
                                onCheckedChange={() =>
                                  toggleTaskCompletion(task.id)
                                }
                                className="h-5 w-5"
                              />
                            </div>

                            {/* Task Content */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4
                                  className={`font-semibold text-lg ${
                                    task.is_completed
                                      ? "line-through text-gray-500"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {task.title}
                                </h4>

                                {/* Priority Badge */}
                                {task.priority && (
                                  <Badge
                                    variant="outline"
                                    className={getPriorityColor(task.priority)}
                                  >
                                    <Flag className="h-3 w-3 mr-1" />
                                    {task.priority}
                                  </Badge>
                                )}
                              </div>

                              {task.description && (
                                <p
                                  className={`text-sm mb-3 ${
                                    task.is_completed
                                      ? "line-through text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {task.description}
                                </p>
                              )}

                              {/* Task Metadata */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(task.created_at).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                </span>

                                {task.due_date && (
                                  <span
                                    className={`flex items-center gap-1 ${
                                      isOverdue(task.due_date) &&
                                      !task.is_completed
                                        ? "text-red-600 font-medium"
                                        : ""
                                    }`}
                                  >
                                    <Clock className="h-3 w-3" />
                                    Due:{" "}
                                    {new Date(task.due_date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                      },
                                    )}
                                    {isOverdue(task.due_date) &&
                                      !task.is_completed && (
                                        <span className="ml-1">(Overdue)</span>
                                      )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(task)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(task.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          {editingTask && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description || ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={editingTask.priority || "medium"}
                  onValueChange={(value: string) =>
                    setEditingTask({ ...editingTask, priority: value as Priority })
                  }
                >
                  <SelectTrigger id="edit-priority" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={editingTask.due_date || ""}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, due_date: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTask}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
