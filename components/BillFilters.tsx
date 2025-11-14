"use client";

import { BillType, NeedWant } from "@/types/db";

interface BillFiltersProps {
  statusFilter: "all" | "active" | "archived";
  typeFilter: BillType | "all";
  needWantFilter: NeedWant | "all";
  urgencyFilter: "all" | "overdue" | "soon" | "normal";
  searchQuery: string;
  onStatusChange: (value: "all" | "active" | "archived") => void;
  onTypeChange: (value: BillType | "all") => void;
  onNeedWantChange: (value: NeedWant | "all") => void;
  onUrgencyChange: (value: "all" | "overdue" | "soon" | "normal") => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function BillFilters({
  statusFilter,
  typeFilter,
  needWantFilter,
  urgencyFilter,
  searchQuery,
  onStatusChange,
  onTypeChange,
  onNeedWantChange,
  onUrgencyChange,
  onSearchChange,
  onClearFilters,
  activeFilterCount,
}: BillFiltersProps) {
  return (
    <div className="mb-4 space-y-3">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as "all" | "active" | "archived")
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Bills</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value as BillType | "all")}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Types</option>
            <option value="utility">Utility</option>
            <option value="loan">Loan</option>
            <option value="credit_card">Credit Card</option>
            <option value="subscription">Subscription</option>
            <option value="insurance">Insurance</option>
            <option value="rent_mortgage">Rent/Mortgage</option>
            <option value="tax">Tax</option>
            <option value="phone_internet">Phone/Internet</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Need/Want Filter */}
        <div>
          <select
            value={needWantFilter}
            onChange={(e) =>
              onNeedWantChange(e.target.value as NeedWant | "all")
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">Need/Want</option>
            <option value="need">Need</option>
            <option value="want">Want</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>

        {/* Urgency Filter */}
        <div>
          <select
            value={urgencyFilter}
            onChange={(e) =>
              onUrgencyChange(
                e.target.value as "all" | "overdue" | "soon" | "normal"
              )
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="soon">Due Soon (3 days)</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search bills..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Active Filters Chips */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>

          {statusFilter !== "all" && (
            <button
              onClick={() => onStatusChange("all")}
              className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors flex items-center gap-1"
            >
              Status: {statusFilter}
              <span>×</span>
            </button>
          )}

          {typeFilter !== "all" && (
            <button
              onClick={() => onTypeChange("all")}
              className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors flex items-center gap-1"
            >
              Type: {typeFilter}
              <span>×</span>
            </button>
          )}

          {needWantFilter !== "all" && (
            <button
              onClick={() => onNeedWantChange("all")}
              className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors flex items-center gap-1"
            >
              {needWantFilter}
              <span>×</span>
            </button>
          )}

          {urgencyFilter !== "all" && (
            <button
              onClick={() => onUrgencyChange("all")}
              className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors flex items-center gap-1"
            >
              {urgencyFilter}
              <span>×</span>
            </button>
          )}

          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors flex items-center gap-1"
            >
              Search: "{searchQuery}"
              <span>×</span>
            </button>
          )}

          <button
            onClick={onClearFilters}
            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

