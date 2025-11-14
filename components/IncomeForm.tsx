"use client";

import { useState, useEffect } from "react";
import { IncomeFrequency, Account } from "@/types/db";
import { useToast } from "@/contexts/ToastContext";
import { getFrequencyLabel } from "@/lib/utils/billDates";

interface IncomeFormProps {
  income?: {
    id: string;
    source_name: string;
    amount: number;
    frequency: IncomeFrequency;
    next_date: string;
    account_id: string | null;
    notes: string | null;
  } | null;
  accounts: Account[];
  onSubmit: (incomeData: {
    source_name: string;
    amount: number;
    frequency: IncomeFrequency;
    next_date: string;
    account_id: string | null;
    notes: string;
  }) => Promise<boolean>;
}

export default function IncomeForm({ income, accounts, onSubmit }: IncomeFormProps) {
  const [sourceName, setSourceName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<IncomeFrequency>("monthly");
  const [nextDate, setNextDate] = useState("");
  const [accountId, setAccountId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Populate form when editing
  useEffect(() => {
    if (income) {
      setSourceName(income.source_name);
      setAmount(income.amount.toString());
      setFrequency(income.frequency);
      setNextDate(income.next_date);
      setAccountId(income.account_id || "");
      setNotes(income.notes || "");
    } else {
      // Reset form for adding
      setSourceName("");
      setAmount("");
      setFrequency("monthly");
      // Set next date to today by default
      const today = new Date();
      setNextDate(today.toISOString().split('T')[0]);
      setAccountId("");
      setNotes("");
    }
  }, [income]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!sourceName.trim()) {
      toast.warning("Please enter a source name");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }

    if (!nextDate) {
      toast.warning("Please select the next payment date");
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({
      source_name: sourceName.trim(),
      amount: parseFloat(amount),
      frequency,
      next_date: nextDate,
      account_id: accountId || null,
      notes: notes.trim(),
    });

    if (success) {
      // Form will be reset by parent component closing modal
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Source Name */}
      <div>
        <label
          htmlFor="source_name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Source Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="source_name"
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="e.g., Salary, Freelance, Side Hustle"
          required
        />
      </div>

      {/* Amount */}
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Amount <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="0.00"
          required
        />
      </div>

      {/* Frequency */}
      <div>
        <label
          htmlFor="frequency"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Frequency <span className="text-red-500">*</span>
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as IncomeFrequency)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          required
        >
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly (every 2 weeks)</option>
          <option value="monthly">Monthly</option>
          <option value="bimonthly">Bi-monthly (every 2 months)</option>
          <option value="quarterly">Quarterly (every 3 months)</option>
          <option value="annual">Annual</option>
          <option value="one_time">One-time</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {frequency === "one_time"
            ? "This income will not recur"
            : "Next date will auto-advance when it passes"}
        </p>
      </div>

      {/* Next Date */}
      <div>
        <label
          htmlFor="next_date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Next Payment Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="next_date"
          value={nextDate}
          onChange={(e) => setNextDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          required
        />
      </div>

      {/* Deposit Account */}
      <div>
        <label
          htmlFor="account_id"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Deposit Account
        </label>
        <select
          id="account_id"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option value="">None selected</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.account_name} ({account.account_type})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Optional - Link to the account where this income is deposited
        </p>
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          placeholder="Additional notes..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting ? (income ? "Updating..." : "Adding...") : (income ? "Update Income" : "Add Income")}
      </button>
    </form>
  );
}

