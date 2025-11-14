"use client";

import { useEffect, useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import { getTodosForUser } from "@/lib/data/todos";
import { supabase } from "@/lib/supabase/client";
import { Todo, TaskPriority, TaskStatus } from "@/types/db";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import TodoFilters from "@/components/TodoFilters";
import Modal from "@/components/Modal";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [dueDateFilter, setDueDateFilter] = useState<"all" | "overdue" | "soon" | "no_date" | "has_date">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideCompleted, setHideCompleted] = useState(true); // Default: hide completed

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getTodosForUser(DEMO_USER_ID);
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Failed to load todos. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitTodo(todoData: {
    title: string;
    description: string;
    category: string;
    priority: TaskPriority;
    due_date: string | null;
  }) {
    try {
      if (editingTodo) {
        // Update existing todo
        const { data, error } = await supabase
          .from("todos")
          .update({
            title: todoData.title,
            description: todoData.description || null,
            category: todoData.category || null,
            priority: todoData.priority,
            due_date: todoData.due_date || null,
          })
          .eq("id", editingTodo.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setTodos(
          todos.map((todo) =>
            todo.id === editingTodo.id ? (data as Todo) : todo
          )
        );
      } else {
        // Add new todo
        const { data, error } = await supabase
          .from("todos")
          .insert({
            user_id: DEMO_USER_ID,
            title: todoData.title,
            description: todoData.description || null,
            category: todoData.category || null,
            priority: todoData.priority,
            due_date: todoData.due_date || null,
            status: "todo",
            is_active: false,
          })
          .select()
          .single();

        if (error) throw error;

        // Add new todo to the list
        setTodos([data as Todo, ...todos]);
      }

      setIsModalOpen(false);
      setEditingTodo(null);
      return true;
    } catch (err) {
      console.error("Error saving todo:", err);
      setError(
        editingTodo
          ? "Failed to update todo. Please try again."
          : "Failed to add todo. Please try again."
      );
      return false;
    }
  }

  async function handleToggleActive(todoId: string, currentActive: boolean) {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ is_active: !currentActive })
        .eq("id", todoId);

      if (error) throw error;

      // Update local state
      setTodos(
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, is_active: !currentActive } : todo
        )
      );
    } catch (err) {
      console.error("Error toggling active:", err);
      setError("Failed to update todo. Please try again.");
    }
  }

  async function handleMarkDone(todoId: string) {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ status: "done", is_active: false })
        .eq("id", todoId);

      if (error) throw error;

      // Update local state
      setTodos(
        todos.map((todo) =>
          todo.id === todoId
            ? { ...todo, status: "done", is_active: false }
            : todo
        )
      );
    } catch (err) {
      console.error("Error marking todo as done:", err);
      setError("Failed to mark todo as done. Please try again.");
    }
  }

  async function handleReopenTodo(todoId: string) {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ status: "todo", is_active: false })
        .eq("id", todoId);

      if (error) throw error;

      // Update local state
      setTodos(
        todos.map((todo) =>
          todo.id === todoId
            ? { ...todo, status: "todo", is_active: false }
            : todo
        )
      );
    } catch (err) {
      console.error("Error reopening todo:", err);
      setError("Failed to reopen todo. Please try again.");
    }
  }

  // Filter todos based on all active filters
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Hide completed by default
      if (hideCompleted && todo.status === "done") return false;

      // Status filter
      if (statusFilter !== "all" && todo.status !== statusFilter) return false;

      // Priority filter
      if (priorityFilter !== "all" && todo.priority !== priorityFilter) return false;

      // Active filter
      if (activeFilter === "active" && !todo.is_active) return false;
      if (activeFilter === "inactive" && todo.is_active) return false;

      // Due date filter
      if (dueDateFilter !== "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dueDateFilter === "no_date") {
          if (todo.due_date !== null) return false;
        } else if (dueDateFilter === "has_date") {
          if (todo.due_date === null) return false;
        } else if (todo.due_date) {
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (dueDateFilter === "overdue" && diffDays >= 0) return false;
          if (dueDateFilter === "soon" && (diffDays < 0 || diffDays > 7)) return false;
        } else if (dueDateFilter === "overdue" || dueDateFilter === "soon") {
          return false; // No due date, but filter requires one
        }
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(query);
        const matchesDescription = todo.description?.toLowerCase().includes(query);
        const matchesCategory = todo.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDescription && !matchesCategory) return false;
      }

      return true;
    });
  }, [todos, hideCompleted, statusFilter, priorityFilter, activeFilter, dueDateFilter, searchQuery]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (priorityFilter !== "all") count++;
    if (activeFilter !== "all") count++;
    if (dueDateFilter !== "all") count++;
    if (searchQuery) count++;
    return count;
  }, [statusFilter, priorityFilter, activeFilter, dueDateFilter, searchQuery]);

  function handleClearFilters() {
    setStatusFilter("all");
    setPriorityFilter("all");
    setActiveFilter("all");
    setDueDateFilter("all");
    setSearchQuery("");
  }

  function handleOpenAddModal() {
    setEditingTodo(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(todo: Todo) {
    setEditingTodo(todo);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingTodo(null);
  }

  async function handleDeleteTodo(todoId: string) {
    if (!confirm("Are you sure you want to delete this todo?")) {
      return;
    }

    try {
      const { error } = await supabase.from("todos").delete().eq("id", todoId);

      if (error) throw error;

      // Remove from local state
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo. Please try again.");
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <PageHeader
            title="Todos"
            subtitle="Capture and manage everything you need to do."
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex-shrink-0"
        >
          + Add Todo
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Filters */}
      <TodoFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        activeFilter={activeFilter}
        dueDateFilter={dueDateFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onActiveChange={setActiveFilter}
        onDueDateChange={setDueDateFilter}
        onSearchChange={setSearchQuery}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Toggle for hiding completed */}
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={(e) => setHideCompleted(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          Hide completed todos
        </label>
        <span className="text-sm text-gray-500">
          Showing {filteredTodos.length} of {todos.length} todos
        </span>
      </div>

      {/* Todos list */}
      <TodoList
        todos={filteredTodos}
        isLoading={isLoading}
        onToggleActive={handleToggleActive}
        onMarkDone={handleMarkDone}
        onReopenTodo={handleReopenTodo}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteTodo}
      />

      {/* Add/Edit Todo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTodo ? "Edit Todo" : "Add New Todo"}
      >
        <TodoForm todo={editingTodo} onSubmit={handleSubmitTodo} />
      </Modal>
    </div>
  );
}
