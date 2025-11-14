"use client";

import { Income, Account, IncomeFrequency } from "@/types/db";
import { getFrequencyLabel } from "@/lib/utils/billDates";

interface IncomeListProps {
  income: Income[];
  accounts: Account[];
  isLoading: boolean;
  onToggleActive: (incomeId: string, currentActive: boolean) => void;
  onEdit: (income: Income) => void;
  onDelete: (incomeId: string) => void;
}

export default function IncomeList({
  income,
  accounts,
  isLoading,
  onToggleActive,
  onEdit,
  onDelete,
}: IncomeListProps) {
  function getAccountName(accountId: string | null): string {
    if (!accountId) return "No account";
    const account = accounts.find((a) => a.id === accountId);
    return account ? account.account_name : "Unknown account";
  }

  function getDaysUntil(nextDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = new Date(nextDate);
    next.setHours(0, 0, 0, 0);
    
    const diffTime = next.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">Loading income sources...</p>
      </div>
    );
  }

  if (income.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">
          No income sources found. Add your first income source to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">All Income Sources</h2>
      <div className="space-y-3">
        {income.map((inc) => {
          const daysUntil = getDaysUntil(inc.next_date);
          const isUpcoming = daysUntil >= 0 && daysUntil <= 7;

          return (
            <div
              key={inc.id}
              className={`border rounded-lg p-4 ${
                inc.is_active
                  ? isUpcoming
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-white"
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Source Name & Status */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {inc.source_name}
                    </h3>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {getFrequencyLabel(inc.frequency as any)}
                    </span>
                    {!inc.is_active && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                        Inactive
                      </span>
                    )}
                    {isUpcoming && inc.is_active && (
                      <span className="px-2 py-0.5 bg-green-200 text-green-700 rounded text-xs font-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="mb-2">
                    <span className="text-lg font-bold text-green-600">
                      ${inc.amount.toFixed(2)}
                    </span>
                  </div>

                  {/* Next Date */}
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Next payment:</span>{" "}
                    {new Date(inc.next_date).toLocaleDateString()}
                    {daysUntil === 0 && " (Today!)"}
                    {daysUntil === 1 && " (Tomorrow)"}
                    {daysUntil > 1 && daysUntil <= 7 && ` (in ${daysUntil} days)`}
                  </div>

                  {/* Account */}
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Deposit to:</span>{" "}
                    {getAccountName(inc.account_id)}
                  </div>

                  {/* Notes */}
                  {inc.notes && (
                    <p className="text-sm text-gray-600 mt-2">💭 {inc.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => onEdit(inc)}
                    className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onToggleActive(inc.id, inc.is_active)}
                    className={`px-3 py-1 text-xs font-medium rounded hover:opacity-80 transition-opacity ${
                      inc.is_active
                        ? "bg-gray-100 text-gray-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {inc.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => onDelete(inc.id)}
                    className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

