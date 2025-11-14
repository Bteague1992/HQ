"use client";

import { Income } from "@/types/db";

interface IncomeStatsProps {
  income: Income[];
}

export default function IncomeStats({ income }: IncomeStatsProps) {
  const activeIncome = income.filter((i) => i.is_active);

  // Calculate monthly equivalent for each income based on frequency
  function getMonthlyAmount(inc: Income): number {
    const multipliers: Record<string, number> = {
      weekly: 4.33,
      biweekly: 2.17,
      monthly: 1,
      bimonthly: 0.5,
      quarterly: 0.33,
      annual: 0.083,
      one_time: 0, // Don't count in recurring totals
    };

    return inc.amount * (multipliers[inc.frequency] || 0);
  }

  // Total monthly income
  const monthlyIncome = activeIncome.reduce((sum, inc) => {
    return sum + getMonthlyAmount(inc);
  }, 0);

  // Total annual income
  const annualIncome = monthlyIncome * 12;

  // Count upcoming in next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingIncome = activeIncome.filter((inc) => {
    const nextDate = new Date(inc.next_date);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate >= today && nextDate <= nextWeek;
  });

  const upcomingAmount = upcomingIncome.reduce((sum, inc) => sum + inc.amount, 0);

  // Find next income date
  const nextIncome = activeIncome
    .filter((inc) => {
      const nextDate = new Date(inc.next_date);
      nextDate.setHours(0, 0, 0, 0);
      return nextDate >= today;
    })
    .sort((a, b) => {
      return new Date(a.next_date).getTime() - new Date(b.next_date).getTime();
    })[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Monthly Income */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Monthly Income</p>
            <p className="text-2xl font-bold text-green-600">
              ${monthlyIncome.toFixed(2)}
            </p>
          </div>
          <div className="text-3xl">💵</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Average per month
        </p>
      </div>

      {/* Annual Income */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Annual Income</p>
            <p className="text-2xl font-bold text-indigo-600">
              ${annualIncome.toFixed(2)}
            </p>
          </div>
          <div className="text-3xl">📊</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Projected yearly total
        </p>
      </div>

      {/* Upcoming Income */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Next 7 Days</p>
            <p className="text-2xl font-bold text-purple-600">
              ${upcomingAmount.toFixed(2)}
            </p>
          </div>
          <div className="text-3xl">📅</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {upcomingIncome.length} payment{upcomingIncome.length !== 1 ? "s" : ""} expected
        </p>
      </div>

      {/* Next Income */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Next Income</p>
            <p className="text-2xl font-bold text-green-600">
              {nextIncome ? `$${nextIncome.amount.toFixed(2)}` : "—"}
            </p>
          </div>
          <div className="text-3xl">💰</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {nextIncome
            ? new Date(nextIncome.next_date).toLocaleDateString()
            : "No upcoming income"}
        </p>
      </div>
    </div>
  );
}

