"use client";

import { Bill } from "@/types/db";

interface BillStatsProps {
  bills: Bill[];
}

export default function BillStats({ bills }: BillStatsProps) {
  // Filter to active bills only
  const activeBills = bills.filter((b) => b.is_active);

  // Total debt (sum of balances)
  const totalDebt = activeBills.reduce(
    (sum, bill) => sum + (bill.balance || 0),
    0
  );

  // Monthly bills total (sum of all amounts)
  const monthlyBills = activeBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Annual total
  const annualBills = monthlyBills * 12;

  // Weekly savings needed
  const weeklySavings = annualBills / 52;

  // Count autopay
  const autopayCount = activeBills.filter((b) => b.autopay).length;
  const autopayPercentage =
    activeBills.length > 0
      ? Math.round((autopayCount / activeBills.length) * 100)
      : 0;

  // High interest debt (>10%)
  const highInterestDebt = activeBills
    .filter((b) => b.interest_rate && b.interest_rate > 10 && b.balance)
    .reduce((sum, bill) => sum + (bill.balance || 0), 0);

  // Needs vs Wants breakdown
  const needsTotal = activeBills
    .filter((b) => b.need_or_want === "need")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const wantsTotal = activeBills
    .filter((b) => b.need_or_want === "want")
    .reduce((sum, bill) => sum + bill.amount, 0);

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const stats = [
    {
      label: "Total Debt",
      value: formatCurrency(totalDebt),
      subtitle: highInterestDebt > 0 ? `${formatCurrency(highInterestDebt)} high interest` : null,
      icon: "💳",
      color: totalDebt > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
      iconBg: totalDebt > 0 ? "bg-red-500" : "bg-green-500",
    },
    {
      label: "Monthly Bills",
      value: formatCurrency(monthlyBills),
      subtitle: `${formatCurrency(needsTotal)} needs • ${formatCurrency(wantsTotal)} wants`,
      icon: "📅",
      color: "bg-blue-100 text-blue-700",
      iconBg: "bg-blue-500",
    },
    {
      label: "Annual Total",
      value: formatCurrency(annualBills),
      subtitle: `${autopayPercentage}% on autopay (${autopayCount}/${activeBills.length})`,
      icon: "📊",
      color: "bg-purple-100 text-purple-700",
      iconBg: "bg-purple-500",
    },
    {
      label: "Weekly Savings Goal",
      value: formatCurrency(weeklySavings),
      subtitle: "To cover all bills",
      icon: "💰",
      color: "bg-amber-100 text-amber-700",
      iconBg: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-1 truncate">
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 leading-relaxed">
                  {stat.subtitle}
                </p>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center text-2xl flex-shrink-0 ml-2`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

