"use client";

import { Todo } from "@/types/db";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggleActive: (todoId: string, currentActive: boolean) => void;
  onMarkDone: (todoId: string) => void;
  onReopenTodo: (todoId: string) => void;
}

export default function TodoList({
  todos,
  isLoading,
  onToggleActive,
  onMarkDone,
  onReopenTodo,
}: TodoListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">All Todos</h2>
        <p className="text-gray-500 text-center py-8">Loading todos...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">All Todos</h2>
        <p className="text-gray-500 text-center py-8">
          No todos yet. Add your first one on the left.
        </p>
      </div>
    );
  }

  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const statusColors = {
    todo: "bg-blue-100 text-blue-800",
    in_progress: "bg-purple-100 text-purple-800",
    done: "bg-green-100 text-green-800",
  };

  const statusLabels = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        All Todos ({todos.length})
      </h2>
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3
                    className={`font-semibold text-gray-900 ${
                      todo.status === "done" ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.is_active && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                      Active
                    </span>
                  )}
                </div>

                {todo.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {todo.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {todo.category && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
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
                  <span
                    className={`px-2 py-1 rounded ${statusColors[todo.status]}`}
                  >
                    {statusLabels[todo.status]}
                  </span>
                  {todo.due_date ? (
                    <span className="text-gray-600">
                      Due: {new Date(todo.due_date).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded">
                      📌 No due date
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                {todo.status !== "done" && (
                  <>
                    <button
                      onClick={() => onToggleActive(todo.id, todo.is_active)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        todo.is_active
                          ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {todo.is_active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => onMarkDone(todo.id)}
                      className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Mark Done
                    </button>
                  </>
                )}

                {todo.status === "done" && (
                  <button
                    onClick={() => onReopenTodo(todo.id)}
                    className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

