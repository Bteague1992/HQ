"use client";

import { useState, useEffect } from "react";
import { JobStatus, TeagueJob } from "@/types/db";
import { useToast } from "@/contexts/ToastContext";

interface JobFormProps {
  job?: TeagueJob | null;
  onSubmit: (jobData: {
    client_name: string;
    client_phone: string;
    client_email: string;
    job_description: string;
    quote_amount: number | null;
    concerns: string;
    status: JobStatus;
    scheduled_date: string;
  }) => Promise<boolean>;
  onCancel?: () => void;
}

export default function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [concerns, setConcerns] = useState("");
  const [status, setStatus] = useState<JobStatus>("lead");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Populate form when editing
  useEffect(() => {
    if (job) {
      setClientName(job.client_name);
      setClientPhone(job.client_phone || "");
      setClientEmail(job.client_email || "");
      setJobDescription(job.job_description);
      setQuoteAmount(job.quote_amount ? job.quote_amount.toString() : "");
      setConcerns(job.concerns || "");
      setStatus(job.status);
      setScheduledDate(job.scheduled_date || "");
    } else {
      // Reset form for adding
      setClientName("");
      setClientPhone("");
      setClientEmail("");
      setJobDescription("");
      setQuoteAmount("");
      setConcerns("");
      setStatus("lead");
      setScheduledDate("");
    }
  }, [job]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!clientName.trim()) {
      toast.warning("Please enter a client name");
      return;
    }

    if (!jobDescription.trim()) {
      toast.warning("Please enter a job description");
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({
      client_name: clientName.trim(),
      client_phone: clientPhone.trim(),
      client_email: clientEmail.trim(),
      job_description: jobDescription.trim(),
      quote_amount: quoteAmount ? parseFloat(quoteAmount) : null,
      concerns: concerns.trim(),
      status,
      scheduled_date: scheduledDate,
    });

    setIsSubmitting(false);

    if (success && !job) {
      // Clear form only when adding (not editing)
      setClientName("");
      setClientPhone("");
      setClientEmail("");
      setJobDescription("");
      setQuoteAmount("");
      setConcerns("");
      setStatus("lead");
      setScheduledDate("");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="client_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="client_name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label
              htmlFor="client_phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              id="client_phone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="336-555-0123"
            />
          </div>

          <div>
            <label
              htmlFor="client_email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="client_email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label
            htmlFor="job_description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="job_description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="Large oak tree removal near house..."
            required
          />
        </div>

        {/* Quote and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="quote_amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quote Amount
            </label>
            <input
              type="number"
              id="quote_amount"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="lead">Lead</option>
              <option value="quoted">Quoted</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="scheduled_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Scheduled Date
            </label>
            <input
              type="date"
              id="scheduled_date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Concerns */}
        <div>
          <label
            htmlFor="concerns"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Concerns
          </label>
          <textarea
            id="concerns"
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="Near power lines, soft ground, dogs, etc."
          />
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? (job ? "Saving..." : "Adding...") : (job ? "Save Changes" : "Add Job")}
          </button>
        </div>
      </form>
    </div>
  );
}

