"use client";

import { Account } from "@/types/db";

interface AccountStatsProps {
  accounts: Account[];
}

export default function AccountStats({ accounts }: AccountStatsProps) {
  const activeAccounts = accounts.filter((a) => a.is_active);

  // Calculate total balance (assets minus liabilities)
  const totalBalance = activeAccounts.reduce((sum, account) => {
    return sum + account.current_balance;
  }, 0);

  // Calculate assets (positive balances)
  const totalAssets = activeAccounts
    .filter((a) => a.current_balance > 0)
    .reduce((sum, account) => sum + account.current_balance, 0);

  // Calculate liabilities (negative balances - debts)
  const totalLiabilities = Math.abs(
    activeAccounts
      .filter((a) => a.current_balance < 0)
      .reduce((sum, account) => sum + account.current_balance, 0)
  );

  // Count by type
  const checking = activeAccounts.filter((a) => a.account_type === "checking")
    .length;
  const savings = activeAccounts.filter((a) => a.account_type === "savings")
    .length;
  const creditCards = activeAccounts.filter(
    (a) => a.account_type === "credit_card"
  ).length;
  const investments = activeAccounts.filter(
    (a) => a.account_type === "investment"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Net Worth */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Net Worth</p>
            <p
              className={`text-2xl font-bold ${
                totalBalance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${totalBalance.toFixed(2)}
            </p>
          </div>
          <div className="text-3xl">💰</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Assets minus liabilities
        </p>
      </div>

      {/* Total Assets */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Assets</p>
            <p className="text-2xl font-bold text-green-600">
              ${totalAssets.toFixed(2)}
            </p>
          </div>
          <div className="text-3xl">📈</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {checking} checking • {savings} savings • {investments} investment
        </p>
      </div>

      {/* Total Liabilities */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Debt</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalLiabilities.toFixed(2)}
            </p>
          </div>
          <div className="text-3xl">💳</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {creditCards} credit card{creditCards !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Account Count */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Active Accounts</p>
            <p className="text-2xl font-bold text-indigo-600">
              {activeAccounts.length}
            </p>
          </div>
          <div className="text-3xl">🏦</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {accounts.length - activeAccounts.length} archived
        </p>
      </div>
    </div>
  );
}

