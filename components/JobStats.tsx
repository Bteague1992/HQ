"use client";

import { TeagueJob, JobStatus } from "@/types/db";

interface JobStatsProps {
  jobs: TeagueJob[];
  selectedStatuses: JobStatus[];
  onToggleStatus: (status: JobStatus) => void;
  onClearFilter: () => void;
}

export default function JobStats({
  jobs,
  selectedStatuses,
  onToggleStatus,
  onClearFilter,
}: JobStatsProps) {
  // Calculate counts for each status
  const stats = {
    lead: jobs.filter((job) => job.status === "lead").length,
    quoted: jobs.filter((job) => job.status === "quoted").length,
    scheduled: jobs.filter((job) => job.status === "scheduled").length,
    in_progress: jobs.filter((job) => job.status === "in_progress").length,
    completed: jobs.filter((job) => job.status === "completed").length,
    lost: jobs.filter((job) => job.status === "lost").length,
  };

  // Calculate total active (not completed or lost)
  const activeJobs = stats.lead + stats.quoted + stats.scheduled + stats.in_progress;

  // Calculate total revenue from quoted amounts
  const totalQuoted = jobs
    .filter((job) => job.quote_amount)
    .reduce((sum, job) => sum + (job.quote_amount || 0), 0);

  const potentialRevenue = jobs
    .filter((job) => 
      (job.status === "lead" || job.status === "quoted" || job.status === "scheduled" || job.status === "in_progress") 
      && job.quote_amount
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

  const statCards = [
    {
      label: "Leads",
      value: stats.lead,
      color: "bg-gray-100 text-gray-700",
      selectedColor: "bg-gray-600 text-white",
      icon: "🎯",
      status: "lead" as JobStatus,
    },
    {
      label: "Quoted",
      value: stats.quoted,
      color: "bg-blue-100 text-blue-700",
      selectedColor: "bg-blue-600 text-white",
      icon: "💰",
      status: "quoted" as JobStatus,
    },
    {
      label: "Scheduled",
      value: stats.scheduled,
      color: "bg-purple-100 text-purple-700",
      selectedColor: "bg-purple-600 text-white",
      icon: "📅",
      status: "scheduled" as JobStatus,
    },
    {
      label: "In Progress",
      value: stats.in_progress,
      color: "bg-amber-100 text-amber-700",
      selectedColor: "bg-amber-600 text-white",
      icon: "🔨",
      status: "in_progress" as JobStatus,
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "bg-green-100 text-green-700",
      selectedColor: "bg-green-600 text-white",
      icon: "✅",
      status: "completed" as JobStatus,
    },
    {
      label: "Lost",
      value: stats.lost,
      color: "bg-red-100 text-red-700",
      selectedColor: "bg-red-600 text-white",
      icon: "❌",
      status: "lost" as JobStatus,
    },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Potential Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(potentialRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Active jobs with quotes
              </p>
            </div>
            <div className="text-4xl">💵</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Quoted</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(totalQuoted)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                All jobs with quotes
              </p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>

      {/* Status Filter Info */}
      {selectedStatuses.length > 0 && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <span className="text-sm font-medium text-indigo-900">
            Filtering by: {selectedStatuses.length} status{selectedStatuses.length !== 1 ? 'es' : ''}
          </span>
          <button
            onClick={onClearFilter}
            className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Status Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const isSelected = selectedStatuses.includes(stat.status);
          return (
            <button
              key={stat.label}
              onClick={() => onToggleStatus(stat.status)}
              className={`rounded-xl shadow-sm p-4 hover:shadow-md transition-all text-left ${
                isSelected
                  ? `${stat.selectedColor} ring-2 ring-offset-2 ring-indigo-500`
                  : "bg-white hover:scale-105"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  isSelected ? "text-white" : "text-gray-900"
                }`}
              >
                {stat.value}
              </p>
              <p
                className={`text-xs mt-1 ${
                  isSelected ? "text-white/90" : "text-gray-600"
                }`}
              >
                {stat.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

