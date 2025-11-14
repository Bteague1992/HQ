"use client";

import { useState, useEffect } from "react";
import { AccountType } from "@/types/db";
import { useToast } from "@/contexts/ToastContext";

interface AccountFormProps {
  account?: {
    id: string;
    account_name: string;
    account_type: AccountType;
    current_balance: number;
    institution_name: string | null;
    account_number_last4: string | null;
    notes: string | null;
  } | null;
  onSubmit: (accountData: {
    account_name: string;
    account_type: AccountType;
    current_balance: number;
    institution_name: string;
    account_number_last4: string;
    notes: string;
  }) => Promise<boolean>;
}

export default function AccountForm({ account, onSubmit }: AccountFormProps) {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("checking");
  const [currentBalance, setCurrentBalance] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [accountNumberLast4, setAccountNumberLast4] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Populate form when editing
  useEffect(() => {
    if (account) {
      setAccountName(account.account_name);
      setAccountType(account.account_type);
      setCurrentBalance(account.current_balance.toString());
      setInstitutionName(account.institution_name || "");
      setAccountNumberLast4(account.account_number_last4 || "");
      setNotes(account.notes || "");
    } else {
      // Reset form for adding
      setAccountName("");
      setAccountType("checking");
      setCurrentBalance("0");
      setInstitutionName("");
      setAccountNumberLast4("");
      setNotes("");
    }
  }, [account]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!accountName.trim()) {
      toast.warning("Please enter an account name");
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({
      account_name: accountName.trim(),
      account_type: accountType,
      current_balance: parseFloat(currentBalance) || 0,
      institution_name: institutionName.trim(),
      account_number_last4: accountNumberLast4.trim(),
      notes: notes.trim(),
    });

    if (success) {
      // Form will be reset by parent component closing modal
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Account Name */}
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
          placeholder="e.g., Chase Checking"
          required
        />
      </div>

      {/* Account Type */}
      <div>
        <label
          htmlFor="account_type"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Account Type <span className="text-red-500">*</span>
        </label>
        <select
          id="account_type"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value as AccountType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          required
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit_card">Credit Card</option>
          <option value="investment">Investment</option>
          <option value="cash">Cash</option>
          <option value="loan">Loan</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Current Balance */}
      <div>
        <label
          htmlFor="current_balance"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Current Balance <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="current_balance"
          value={currentBalance}
          onChange={(e) => setCurrentBalance(e.target.value)}
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="0.00"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Use negative values for debts (credit cards, loans)
        </p>
      </div>

      {/* Institution Name */}
      <div>
        <label
          htmlFor="institution_name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Institution Name
        </label>
        <input
          type="text"
          id="institution_name"
          value={institutionName}
          onChange={(e) => setInstitutionName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="e.g., Chase Bank"
        />
      </div>

      {/* Account Number Last 4 */}
      <div>
        <label
          htmlFor="account_number_last4"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Last 4 Digits
        </label>
        <input
          type="text"
          id="account_number_last4"
          value={accountNumberLast4}
          onChange={(e) => setAccountNumberLast4(e.target.value.slice(0, 4))}
          maxLength={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="1234"
        />
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
        {isSubmitting ? (account ? "Updating..." : "Adding...") : (account ? "Update Account" : "Add Account")}
      </button>
    </form>
  );
}

