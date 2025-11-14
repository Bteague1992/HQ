"use client";

import { Account, AccountType } from "@/types/db";

interface AccountListProps {
  accounts: Account[];
  isLoading: boolean;
  onToggleActive: (accountId: string, currentActive: boolean) => void;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
}

function getAccountTypeLabel(type: AccountType): string {
  const labels: Record<AccountType, string> = {
    checking: "Checking",
    savings: "Savings",
    credit_card: "Credit Card",
    investment: "Investment",
    cash: "Cash",
    loan: "Loan",
    other: "Other",
  };
  return labels[type];
}

function getAccountTypeColor(type: AccountType): string {
  const colors: Record<AccountType, string> = {
    checking: "bg-blue-100 text-blue-700",
    savings: "bg-green-100 text-green-700",
    credit_card: "bg-red-100 text-red-700",
    investment: "bg-purple-100 text-purple-700",
    cash: "bg-yellow-100 text-yellow-700",
    loan: "bg-orange-100 text-orange-700",
    other: "bg-gray-100 text-gray-700",
  };
  return colors[type];
}

export default function AccountList({
  accounts,
  isLoading,
  onToggleActive,
  onEdit,
  onDelete,
}: AccountListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">Loading accounts...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">
          No accounts found. Add your first account to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">All Accounts</h2>
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`border rounded-lg p-4 ${
              account.is_active
                ? "border-gray-200 bg-white"
                : "border-gray-200 bg-gray-50 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Account Name & Type */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {account.account_name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getAccountTypeColor(
                      account.account_type
                    )}`}
                  >
                    {getAccountTypeLabel(account.account_type)}
                  </span>
                  {!account.is_active && (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                      Archived
                    </span>
                  )}
                </div>

                {/* Institution & Account Number */}
                <div className="text-sm text-gray-600 mb-2">
                  {account.institution_name && (
                    <span className="mr-3">🏦 {account.institution_name}</span>
                  )}
                  {account.account_number_last4 && (
                    <span>···· {account.account_number_last4}</span>
                  )}
                </div>

                {/* Balance */}
                <div className="mb-2">
                  <span
                    className={`text-lg font-bold ${
                      account.current_balance >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${Math.abs(account.current_balance).toFixed(2)}
                  </span>
                  {account.current_balance < 0 && (
                    <span className="text-sm text-red-600 ml-1">(debt)</span>
                  )}
                </div>

                {/* Notes */}
                {account.notes && (
                  <p className="text-sm text-gray-600 mt-2">💭 {account.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => onEdit(account)}
                  className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleActive(account.id, account.is_active)}
                  className={`px-3 py-1 text-xs font-medium rounded hover:opacity-80 transition-opacity ${
                    account.is_active
                      ? "bg-gray-100 text-gray-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {account.is_active ? "Archive" : "Restore"}
                </button>
                <button
                  onClick={() => onDelete(account.id)}
                  className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

