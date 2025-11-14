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

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function BusinessPage() {
  const [jobs, setJobs] = useState<TeagueJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<TeagueJob | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<JobStatus[]>([]);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getTeagueJobsForUser(DEMO_USER_ID);
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please refresh the page.");
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
      return true;
    } catch (err) {
      console.error("Error saving job:", err);
      setError(
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
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job. Please try again.");
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
    } catch (err) {
      console.error("Error updating job status:", err);
      setError("Failed to update job status. Please try again.");
    }
  }

  // Filter jobs based on showAll toggle and selected statuses
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Stats */}
      {!isLoading && (
        <JobStats
          jobs={jobs}
          selectedStatuses={selectedStatuses}
          onToggleStatus={handleToggleStatus}
          onClearFilter={handleClearStatusFilter}
        />
      )}

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
