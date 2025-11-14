"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getAccountsForUser } from "@/lib/data/accounts";
import { supabase } from "@/lib/supabase/client";
import { Account, AccountType } from "@/types/db";
import AccountForm from "@/components/AccountForm";
import AccountList from "@/components/AccountList";
import AccountStats from "@/components/AccountStats";
import Modal from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function AccountsPage() {
  const toast = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<AccountType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    setIsLoading(true);
    try {
      const data = await getAccountsForUser(DEMO_USER_ID);
      setAccounts(data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      toast.error("Failed to load accounts. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitAccount(accountData: {
    account_name: string;
    account_type: AccountType;
    current_balance: number;
    institution_name: string;
    account_number_last4: string;
    notes: string;
  }) {
    try {
      if (editingAccount) {
        // Update existing account
        const { data, error } = await supabase
          .from("accounts")
          .update({
            account_name: accountData.account_name,
            account_type: accountData.account_type,
            current_balance: accountData.current_balance,
            institution_name: accountData.institution_name || null,
            account_number_last4: accountData.account_number_last4 || null,
            notes: accountData.notes || null,
          })
          .eq("id", editingAccount.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setAccounts(
          accounts.map((account) =>
            account.id === editingAccount.id ? (data as Account) : account
          )
        );
      } else {
        // Add new account
        const { data, error } = await supabase
          .from("accounts")
          .insert({
            user_id: DEMO_USER_ID,
            account_name: accountData.account_name,
            account_type: accountData.account_type,
            current_balance: accountData.current_balance,
            institution_name: accountData.institution_name || null,
            account_number_last4: accountData.account_number_last4 || null,
            notes: accountData.notes || null,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;

        // Add new account to the list
        setAccounts([data as Account, ...accounts]);
      }

      setIsModalOpen(false);
      setEditingAccount(null);
      toast.success(editingAccount ? "Account updated!" : "Account added!");
      return true;
    } catch (err) {
      console.error("Error saving account:", err);
      toast.error(
        editingAccount
          ? "Failed to update account. Please try again."
          : "Failed to add account. Please try again."
      );
      return false;
    }
  }

  async function handleToggleActive(accountId: string, currentActive: boolean) {
    try {
      const { error } = await supabase
        .from("accounts")
        .update({ is_active: !currentActive })
        .eq("id", accountId);

      if (error) throw error;

      // Update local state
      setAccounts(
        accounts.map((account) =>
          account.id === accountId ? { ...account, is_active: !currentActive } : account
        )
      );
      toast.success(currentActive ? "Account archived!" : "Account restored!");
    } catch (err) {
      console.error("Error toggling account:", err);
      toast.error("Failed to update account. Please try again.");
    }
  }

  async function handleDeleteAccount(accountId: string) {
    if (!confirm("Are you sure you want to permanently delete this account?")) {
      return;
    }

    try {
      const { error } = await supabase.from("accounts").delete().eq("id", accountId);

      if (error) throw error;

      // Remove from local state
      setAccounts(accounts.filter((account) => account.id !== accountId));
      toast.success("Account deleted!");
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("Failed to delete account. Please try again.");
    }
  }

  function handleOpenAddModal() {
    setEditingAccount(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(account: Account) {
    setEditingAccount(account);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingAccount(null);
  }

  // Filter accounts
  const filteredAccounts = accounts.filter((account) => {
    // Type filter
    if (typeFilter !== "all" && account.account_type !== typeFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === "active" && !account.is_active) return false;
    if (statusFilter === "inactive" && account.is_active) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = account.account_name.toLowerCase().includes(query);
      const matchesInstitution = account.institution_name?.toLowerCase().includes(query);
      
      return matchesName || matchesInstitution;
    }

    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Accounts"
          subtitle="Track bank accounts, credit cards, and investments."
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
          Add Account
        </button>
      </div>

      {/* Stats */}
      {!isLoading && <AccountStats accounts={accounts} />}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AccountType | "all")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Types</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit_card">Credit Card</option>
              <option value="investment">Investment</option>
              <option value="cash">Cash</option>
              <option value="loan">Loan</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Accounts</option>
              <option value="active">Active Only</option>
              <option value="inactive">Archived Only</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accounts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <AccountList
        accounts={filteredAccounts}
        isLoading={isLoading}
        onToggleActive={handleToggleActive}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteAccount}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAccount ? "Edit Account" : "Add New Account"}
      >
        <AccountForm account={editingAccount} onSubmit={handleSubmitAccount} />
      </Modal>
    </div>
  );
}

