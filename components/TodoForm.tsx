"use client";

import { useState } from "react";
import { TaskPriority } from "@/types/db";
import { useToast } from "@/contexts/ToastContext";

interface TodoFormProps {
  todo?: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    priority: TaskPriority;
    due_date: string | null;
  } | null;
  onSubmit: (todoData: {
    title: string;
    description: string;
    category: string;
    priority: TaskPriority;
    due_date: string | null;
  }) => Promise<boolean>;
}

export default function TodoForm({ todo, onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [category, setCategory] = useState(todo?.category || "");
  const [priority, setPriority] = useState<TaskPriority>(
    todo?.priority || "medium"
  );
  const [dueDate, setDueDate] = useState(todo?.due_date || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      priority,
      due_date: dueDate || null,
    });

    if (success) {
      // Clear form
      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("medium");
      setDueDate("");
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          placeholder="Optional details..."
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="e.g., money, home, teague, fluffy"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="due_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date
          </label>
          <input
            type="date"
            id="due_date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional - leave blank for no deadline
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting
          ? todo
            ? "Updating..."
            : "Adding..."
          : todo
          ? "Update Todo"
          : "Add Todo"}
      </button>
    </form>
  );
}
