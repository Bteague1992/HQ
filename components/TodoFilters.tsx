"use client";

import { TaskPriority, TaskStatus } from "@/types/db";

interface TodoFiltersProps {
  statusFilter: TaskStatus | "all";
  priorityFilter: TaskPriority | "all";
  activeFilter: "all" | "active" | "inactive";
  dueDateFilter: "all" | "overdue" | "soon" | "no_date" | "has_date";
  searchQuery: string;
  onStatusChange: (status: TaskStatus | "all") => void;
  onPriorityChange: (priority: TaskPriority | "all") => void;
  onActiveChange: (active: "all" | "active" | "inactive") => void;
  onDueDateChange: (dueDate: "all" | "overdue" | "soon" | "no_date" | "has_date") => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function TodoFilters({
  statusFilter,
  priorityFilter,
  activeFilter,
  dueDateFilter,
  searchQuery,
  onStatusChange,
  onPriorityChange,
  onActiveChange,
  onDueDateChange,
  onSearchChange,
  onClearFilters,
  activeFilterCount,
}: TodoFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Search */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Search
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search todos..."
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | "all")}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "all")}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Active Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Active Status
          </label>
          <select
            value={activeFilter}
            onChange={(e) => onActiveChange(e.target.value as "all" | "active" | "inactive")}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Due Date Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Due Date
          </label>
          <select
            value={dueDateFilter}
            onChange={(e) => onDueDateChange(e.target.value as "all" | "overdue" | "soon" | "no_date" | "has_date")}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All</option>
            <option value="overdue">Overdue</option>
            <option value="soon">Due Soon (7 days)</option>
            <option value="no_date">No Due Date</option>
            <option value="has_date">Has Due Date</option>
          </select>
        </div>
      </div>
    </div>
  );
}

