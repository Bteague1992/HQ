"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getTodosForUser } from "@/lib/data/todos";
import { supabase } from "@/lib/supabase/client";
import { Todo, TaskPriority } from "@/types/db";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

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

  async function handleAddTodo(todoData: {
    title: string;
    description: string;
    category: string;
    priority: TaskPriority;
    due_date: string | null;
  }) {
    try {
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
      return true;
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add todo. Please try again.");
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

  return (
    <div>
      <PageHeader
        title="Todos"
        subtitle="Capture and manage everything you need to do."
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[2fr,3fr] gap-6">
        {/* Left column: Add Todo form */}
        <TodoForm onAdd={handleAddTodo} />

        {/* Right column: Todos list */}
        <TodoList
          todos={todos}
          isLoading={isLoading}
          onToggleActive={handleToggleActive}
          onMarkDone={handleMarkDone}
          onReopenTodo={handleReopenTodo}
        />
      </div>
    </div>
  );
}
