"use client";

import { Todo, Bill, TeagueJob } from "@/types/db";
import { getBillDueDate, getDaysUntilDue } from "@/lib/utils/billDates";

interface DashboardStatsProps {
  activeTodos: Todo[];
  allBills: Bill[];
  allJobs: TeagueJob[];
}

export default function DashboardStats({
  activeTodos,
  allBills,
  allJobs,
}: DashboardStatsProps) {
  // Calculate bills due in next 7 days (amount)
  const billsDueNext7Days = allBills
    .filter((bill) => {
      const dueDate = getBillDueDate(bill);
      const daysUntil = getDaysUntilDue(dueDate);
      return daysUntil >= 0 && daysUntil <= 7;
    })
    .reduce((sum, bill) => sum + bill.amount, 0);

  // Count overdue bills
  const overdueBills = allBills.filter((bill) => {
    const dueDate = getBillDueDate(bill);
    const daysUntil = getDaysUntilDue(dueDate);
    return daysUntil < 0;
  }).length;

  // Count jobs scheduled in next 7 days
  const jobsNext7Days = allJobs.filter((job) => {
    if (!job.scheduled_date) return false;
    const scheduledDate = new Date(job.scheduled_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    scheduledDate.setHours(0, 0, 0, 0);
    const diffTime = scheduledDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  // Calculate potential revenue from active jobs
  const potentialRevenue = allJobs
    .filter(
      (job) =>
        (job.status === "quoted" ||
          job.status === "scheduled" ||
          job.status === "in_progress") &&
        job.quote_amount
    )
    .reduce((sum, job) => sum + (job.quote_amount || 0), 0);

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
      label: "Active Tasks",
      value: activeTodos.length,
      icon: "✓",
      color: "bg-indigo-100 text-indigo-700",
      iconBg: "bg-indigo-500",
    },
    {
      label: "Bills Due (7 Days)",
      value: formatCurrency(billsDueNext7Days),
      icon: "💵",
      color: "bg-blue-100 text-blue-700",
      iconBg: "bg-blue-500",
      alert: overdueBills > 0 ? `${overdueBills} overdue` : null,
    },
    {
      label: "Jobs This Week",
      value: jobsNext7Days,
      icon: "🌲",
      color: "bg-green-100 text-green-700",
      iconBg: "bg-green-500",
    },
    {
      label: "Pipeline Value",
      value: formatCurrency(potentialRevenue),
      icon: "📊",
      color: "bg-purple-100 text-purple-700",
      iconBg: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              {stat.alert && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  ⚠️ {stat.alert}
                </p>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center text-2xl`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

