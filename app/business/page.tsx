"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getTeagueJobsForUser } from "@/lib/data/teagueJobs";
import { supabase } from "@/lib/supabase/client";
import { TeagueJob, JobStatus } from "@/types/db";
import JobForm from "@/components/JobForm";
import JobList from "@/components/JobList";
import JobStats from "@/components/JobStats";
import Modal from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function BusinessPage() {
  const toast = useToast();
  const [jobs, setJobs] = useState<TeagueJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<TeagueJob | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<JobStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setIsLoading(true);
    try {
      const data = await getTeagueJobsForUser(DEMO_USER_ID);
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to load jobs. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitJob(jobData: {
    client_name: string;
    client_phone: string;
    client_email: string;
    job_description: string;
    quote_amount: number | null;
    concerns: string;
    status: JobStatus;
    scheduled_date: string;
  }) {
    try {
      if (editingJob) {
        // Update existing job
        const { data, error } = await supabase
          .from("teague_jobs")
          .update({
            client_name: jobData.client_name,
            client_phone: jobData.client_phone || null,
            client_email: jobData.client_email || null,
            job_description: jobData.job_description,
            quote_amount: jobData.quote_amount,
            concerns: jobData.concerns || null,
            status: jobData.status,
            scheduled_date: jobData.scheduled_date || null,
          })
          .eq("id", editingJob.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setJobs(
          jobs.map((job) =>
            job.id === editingJob.id ? (data as TeagueJob) : job
          )
        );
      } else {
        // Add new job
        const { data, error } = await supabase
          .from("teague_jobs")
          .insert({
            user_id: DEMO_USER_ID,
            client_name: jobData.client_name,
            client_phone: jobData.client_phone || null,
            client_email: jobData.client_email || null,
            job_description: jobData.job_description,
            quote_amount: jobData.quote_amount,
            concerns: jobData.concerns || null,
            status: jobData.status,
            scheduled_date: jobData.scheduled_date || null,
          })
          .select()
          .single();

        if (error) throw error;

        // Add new job to the list
        setJobs([data as TeagueJob, ...jobs]);
      }

      // Close modal and reset
      setIsModalOpen(false);
      setEditingJob(null);
      toast.success(editingJob ? "Job updated!" : "Job added!");
      return true;
    } catch (err) {
      console.error("Error saving job:", err);
      toast.error(
        editingJob
          ? "Failed to update job. Please try again."
          : "Failed to add job. Please try again."
      );
      return false;
    }
  }

  async function handleDeleteJob(jobId: string) {
    if (!confirm("Are you sure you want to permanently delete this job?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("teague_jobs")
        .delete()
        .eq("id", jobId);

      if (error) throw error;

      // Remove from local state
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job deleted!");
    } catch (err) {
      console.error("Error deleting job:", err);
      toast.error("Failed to delete job. Please try again.");
    }
  }

  function handleOpenAddModal() {
    setEditingJob(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(job: TeagueJob) {
    setEditingJob(job);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingJob(null);
  }

  async function handleUpdateStatus(jobId: string, newStatus: JobStatus) {
    try {
      const { error } = await supabase
        .from("teague_jobs")
        .update({ status: newStatus })
        .eq("id", jobId);

      if (error) throw error;

      // Update local state
      setJobs(
        jobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
      toast.success("Job status updated!");
    } catch (err) {
      console.error("Error updating job status:", err);
      toast.error("Failed to update job status. Please try again.");
    }
  }

  // Filter jobs based on showAll toggle, selected statuses, and search query
  const filteredJobs = (() => {
    let filtered = jobs;

    // If specific statuses are selected, show only those (ignore showAll)
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((job) =>
        selectedStatuses.includes(job.status)
      );
    } else {
      // No status filter applied, use showAll toggle
      if (!showAll) {
        filtered = filtered.filter(
          (job) => job.status !== "completed" && job.status !== "lost"
        );
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((job) => {
        const matchesClient = job.client_name.toLowerCase().includes(query);
        const matchesPhone = job.client_phone?.toLowerCase().includes(query);
        const matchesEmail = job.client_email?.toLowerCase().includes(query);
        const matchesDescription = job.job_description
          .toLowerCase()
          .includes(query);
        const matchesConcerns = job.concerns?.toLowerCase().includes(query);

        return (
          matchesClient ||
          matchesPhone ||
          matchesEmail ||
          matchesDescription ||
          matchesConcerns
        );
      });
    }

    return filtered;
  })();

  function handleToggleStatus(status: JobStatus) {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        // Deselect: remove from array
        return prev.filter((s) => s !== status);
      } else {
        // Select: add to array
        return [...prev, status];
      }
    });
  }

  function handleClearStatusFilter() {
    setSelectedStatuses([]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Jobs"
          subtitle="Track leads, quotes, and scheduled jobs."
        />
        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 4v16m8-8H4" />
          </svg>
          Add Job
        </button>
      </div>

      {/* Stats */}
      {!isLoading && (
        <JobStats
          jobs={jobs}
          selectedStatuses={selectedStatuses}
          onToggleStatus={handleToggleStatus}
          onClearFilter={handleClearStatusFilter}
        />
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, phone, email, job description..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-2">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        )}
      </div>

      {/* Jobs list */}
      <JobList
        jobs={filteredJobs}
        isLoading={isLoading}
        showAll={showAll}
        onToggleShowAll={() => setShowAll(!showAll)}
        onUpdateStatus={handleUpdateStatus}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteJob}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingJob ? "Edit Job" : "Add Job"}
      >
        <JobForm
          job={editingJob}
          onSubmit={handleSubmitJob}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
