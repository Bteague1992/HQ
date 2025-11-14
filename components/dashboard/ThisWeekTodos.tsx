"use client";

import { Todo } from "@/types/db";
import Link from "next/link";

interface ThisWeekTodosProps {
  todos: Todo[];
}

export default function ThisWeekTodos({ todos }: ThisWeekTodosProps) {
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">This Week's Todos</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3">No todos due this week.</p>
          <Link
            href="/todos"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Add a todo →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">This Week's Todos</h2>
        <span className="text-sm text-gray-500">{todos.length} due</span>
      </div>
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {todo.title}
              </p>
              {todo.category && (
                <p className="text-xs text-gray-500">{todo.category}</p>
              )}
            </div>
            {todo.due_date && (
              <span className="text-xs text-gray-600 whitespace-nowrap">
                {formatDate(todo.due_date)}
              </span>
            )}
          </div>
        ))}
      </div>
      <Link
        href="/todos"
        className="block mt-4 text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        View all todos →
      </Link>
    </div>
  );
}

