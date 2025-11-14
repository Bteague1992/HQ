"use client";

import { useState } from "react";
import { BillType, NeedWant, BillFrequency, Account } from "@/types/db";
import { getFrequencyLabel } from "@/lib/utils/billDates";
import { useToast } from "@/contexts/ToastContext";

interface BillFormProps {
  bill?: {
    id: string;
    account_name: string;
    bill_type: BillType;
    need_or_want: NeedWant;
    amount: number;
    balance: number | null;
    due_date: string;
    frequency: BillFrequency;
    autopay: boolean;
    interest_rate: number | null;
    notes: string | null;
    account_id: string | null;
  } | null;
  onSubmit: (billData: {
    account_name: string;
    bill_type: BillType;
    need_or_want: NeedWant;
    amount: number;
    balance: number | null;
    due_date: string;
    frequency: BillFrequency;
    autopay: boolean;
    interest_rate: number | null;
    notes: string;
    account_id: string | null;
  }) => Promise<boolean>;
  accounts: Account[];
}

export default function BillForm({ bill, accounts, onSubmit }: BillFormProps) {
  const [accountName, setAccountName] = useState(bill?.account_name || "");
  const [billType, setBillType] = useState<BillType>(
    bill?.bill_type || "utility"
  );
  const [needOrWant, setNeedOrWant] = useState<NeedWant>(
    bill?.need_or_want || "need"
  );
  const [amount, setAmount] = useState(bill?.amount?.toString() || "");
  const [balance, setBalance] = useState(bill?.balance?.toString() || "");
  const [dueDate, setDueDate] = useState(bill?.due_date || "");
  const [frequency, setFrequency] = useState<BillFrequency>(
    bill?.frequency || "monthly"
  );
  const [autopay, setAutopay] = useState(bill?.autopay || false);
  const [interestRate, setInterestRate] = useState(
    bill?.interest_rate?.toString() || ""
  );
  const [notes, setNotes] = useState(bill?.notes || "");
  const [accountId, setAccountId] = useState<string>(bill?.account_id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!accountName.trim()) {
      toast.warning("Please enter an account name");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }

    if (!dueDate) {
      toast.warning("Please select a due date");
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({
      account_name: accountName.trim(),
      bill_type: billType,
      need_or_want: needOrWant,
      amount: parseFloat(amount),
      balance: balance ? parseFloat(balance) : null,
      due_date: dueDate,
      frequency,
      autopay,
      interest_rate: interestRate ? parseFloat(interestRate) : null,
      notes: notes.trim(),
      account_id: accountId || null,
    });

    if (success) {
      // Clear form
      setAccountName("");
      setBillType("utility");
      setNeedOrWant("need");
      setAmount("");
      setBalance("");
      setDueDate("");
      setFrequency("monthly");
      setAutopay(false);
      setInterestRate("");
      setNotes("");
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="account_name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Account Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="account_name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="e.g., Duke Energy, Netflix"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="bill_type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type
          </label>
          <select
            id="bill_type"
            value={billType}
            onChange={(e) => setBillType(e.target.value as BillType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="utility">Utility</option>
            <option value="loan">Loan</option>
            <option value="credit_card">Credit Card</option>
            <option value="subscription">Subscription</option>
            <option value="insurance">Insurance</option>
            <option value="rent_mortgage">Rent/Mortgage</option>
            <option value="tax">Tax</option>
            <option value="phone_internet">Phone/Internet</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="need_or_want"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Need/Want
          </label>
          <select
            id="need_or_want"
            value={needOrWant}
            onChange={(e) => setNeedOrWant(e.target.value as NeedWant)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="need">Need</option>
            <option value="want">Want</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div>
          <label
            htmlFor="balance"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Balance
          </label>
          <input
            type="number"
            id="balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Optional"
          />
        </div>
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
          onChange={(e) => setFrequency(e.target.value as BillFrequency)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option value="one_time">One-time</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly (every 2 weeks)</option>
          <option value="monthly">Monthly</option>
          <option value="bimonthly">Bi-monthly (every 2 months)</option>
          <option value="quarterly">Quarterly (every 3 months)</option>
          <option value="semiannual">Semi-annual (every 6 months)</option>
          <option value="annual">Annual</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {frequency === "one_time"
            ? "Bill will not recur"
            : `Bill will automatically advance after the due date`}
        </p>
      </div>

      {/* Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="due_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {frequency === "one_time" ? "Due Date" : "Next Due Date"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="due_date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {frequency === "one_time"
              ? "One-time payment date"
              : "Auto-advances when date passes"}
          </p>
        </div>

        <div>
          <label
            htmlFor="interest_rate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interest_rate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={autopay}
            onChange={(e) => setAutopay(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          Autopay enabled
        </label>
      </div>

      {/* Withdraw From Account */}
      <div>
        <label
          htmlFor="account_id"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Withdraw From Account
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
          Optional - Link to the account this bill is paid from
        </p>
      </div>

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
          placeholder="Optional notes..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting
          ? bill
            ? "Updating..."
            : "Adding..."
          : bill
          ? "Update Bill"
          : "Add Bill"}
      </button>
    </form>
  );
}
