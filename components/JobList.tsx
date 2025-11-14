"use client";

import { TeagueJob, JobStatus } from "@/types/db";

interface JobListProps {
  jobs: TeagueJob[];
  isLoading: boolean;
  showAll: boolean;
  onToggleShowAll: () => void;
  onUpdateStatus: (jobId: string, newStatus: JobStatus) => void;
  onEdit: (job: TeagueJob) => void;
  onDelete: (jobId: string) => void;
}

export default function JobList({
  jobs,
  isLoading,
  showAll,
  onToggleShowAll,
  onUpdateStatus,
  onEdit,
  onDelete,
}: JobListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Jobs</h2>
        <p className="text-gray-500 text-center py-8">Loading jobs...</p>
      </div>
    );
  }

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
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Jobs ({jobs.length})</h2>
        <button
          onClick={onToggleShowAll}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            showAll
              ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {showAll ? "Show Active Only" : "Show All"}
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {showAll
            ? "No jobs yet. Add your first one above."
            : "No active jobs. Toggle 'Show All' to see completed and lost jobs."}
        </p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              {/* Header: Client info and status */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {job.client_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                    {job.client_phone && (
                      <a
                        href={`tel:${job.client_phone}`}
                        className="hover:text-indigo-600"
                      >
                        📞 {job.client_phone}
                      </a>
                    )}
                    {job.client_email && (
                      <a
                        href={`mailto:${job.client_email}`}
                        className="hover:text-indigo-600"
                      >
                        ✉️ {job.client_email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[job.status]
                    }`}
                  >
                    {statusLabels[job.status]}
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <p className="text-gray-700 mb-3">{job.job_description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {job.quote_amount && (
                  <div>
                    <span className="text-gray-600">Quote:</span>{" "}
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(job.quote_amount)}
                    </span>
                  </div>
                )}
                {job.scheduled_date && (
                  <div>
                    <span className="text-gray-600">Scheduled:</span>{" "}
                    <span className="font-semibold text-gray-900">
                      {formatDate(job.scheduled_date)}
                    </span>
                  </div>
                )}
              </div>

              {/* Concerns */}
              {job.concerns && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">⚠️ Concerns:</span>{" "}
                    {job.concerns}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor={`status-${job.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Status:
                    </label>
                    <select
                      id={`status-${job.id}`}
                      value={job.status}
                      onChange={(e) =>
                        onUpdateStatus(job.id, e.target.value as JobStatus)
                      }
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="lead">Lead</option>
                      <option value="quoted">Quoted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(job)}
                      className="px-3 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(job.id)}
                      className="px-3 py-1.5 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

