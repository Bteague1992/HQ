"use client";

import { TeagueJob } from "@/types/db";
import Link from "next/link";

interface PendingJobsProps {
  jobs: TeagueJob[];
}

export default function PendingJobs({ jobs }: PendingJobsProps) {
  const statusColors = {
    lead: "bg-gray-100 text-gray-800",
    quoted: "bg-blue-100 text-blue-800",
    scheduled: "bg-purple-100 text-purple-800",
    in_progress: "bg-amber-100 text-amber-800",
    completed: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    lead: "Lead",
    quoted: "Quoted",
    scheduled: "Scheduled",
    in_progress: "In Progress",
    completed: "Completed",
    lost: "Lost",
  };

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Pending Jobs</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3">No pending jobs.</p>
          <Link
            href="/business"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Add a job →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Pending Jobs</h2>
        <span className="text-sm text-gray-500">{jobs.length} active</span>
      </div>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="border-l-4 border-green-500 bg-gray-50 p-3 rounded-r-lg">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{job.client_name}</h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                  {job.job_description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${
                      statusColors[job.status]
                    }`}
                  >
                    {statusLabels[job.status]}
                  </span>
                  {job.scheduled_date && (
                    <span className="text-xs text-gray-600">
                      {new Date(job.scheduled_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              {job.quote_amount && (
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(job.quote_amount)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/business"
        className="block mt-4 text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        View all jobs →
      </Link>
    </div>
  );
}

