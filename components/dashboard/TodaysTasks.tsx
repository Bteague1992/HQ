"use client";

import { Todo } from "@/types/db";
import Link from "next/link";

interface TodaysTasksProps {
  todos: Todo[];
  onMarkDone: (todoId: string) => void;
}

export default function TodaysTasks({ todos, onMarkDone }: TodaysTasksProps) {
  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3">
            No active tasks. Activate a todo from the Todos page.
          </p>
          <Link
            href="/todos"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Go to Todos →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Today's Tasks</h2>
        <span className="text-sm text-gray-500">{todos.length} active</span>
      </div>
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="border-l-4 border-indigo-500 bg-gray-50 p-3 rounded-r-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{todo.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  {todo.category && (
                    <span className="px-2 py-1 bg-white rounded">
                      {todo.category}
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 rounded ${
                      priorityColors[todo.priority]
                    }`}
                  >
                    {todo.priority}
                  </span>
                  {todo.due_date ? (
                    <span className="text-gray-600">
                      Due: {new Date(todo.due_date).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-white text-gray-500 rounded">
                      📌 No due date
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onMarkDone(todo.id)}
                className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex-shrink-0"
              >
                ✓ Done
              </button>
            </div>
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

