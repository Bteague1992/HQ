"use client";

import { useState } from "react";
import { BillType, NeedWant } from "@/types/db";

interface BillFormProps {
  onAdd: (billData: {
    account_name: string;
    bill_type: BillType;
    need_or_want: NeedWant;
    amount: number;
    balance: number | null;
    due_date: string;
    autopay: boolean;
    interest_rate: number | null;
    notes: string;
  }) => Promise<boolean>;
}

export default function BillForm({ onAdd }: BillFormProps) {
  const [accountName, setAccountName] = useState("");
  const [billType, setBillType] = useState<BillType>("utility");
  const [needOrWant, setNeedOrWant] = useState<NeedWant>("need");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [autopay, setAutopay] = useState(false);
  const [interestRate, setInterestRate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!accountName.trim()) {
      alert("Please enter an account name");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!dueDate) {
      alert("Please select a due date");
      return;
    }

    setIsSubmitting(true);
    const success = await onAdd({
      account_name: accountName.trim(),
      bill_type: billType,
      need_or_want: needOrWant,
      amount: parseFloat(amount),
      balance: balance ? parseFloat(balance) : null,
      due_date: dueDate,
      autopay,
      interest_rate: interestRate ? parseFloat(interestRate) : null,
      notes: notes.trim(),
    });

    if (success) {
      // Clear form
      setAccountName("");
      setBillType("utility");
      setNeedOrWant("need");
      setAmount("");
      setBalance("");
      setDueDate("");
      setAutopay(false);
      setInterestRate("");
      setNotes("");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Add Bill</h2>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="due_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="due_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
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
          {isSubmitting ? "Adding..." : "Add Bill"}
        </button>
      </form>
    </div>
  );
}

