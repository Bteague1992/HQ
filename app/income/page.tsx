"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getIncomeForUser } from "@/lib/data/income";
import { getAccountsForUser } from "@/lib/data/accounts";
import { supabase } from "@/lib/supabase/client";
import { Income, Account, IncomeFrequency } from "@/types/db";
import IncomeForm from "@/components/IncomeForm";
import IncomeList from "@/components/IncomeList";
import IncomeStats from "@/components/IncomeStats";
import Modal from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function IncomePage() {
  const toast = useToast();
  const [income, setIncome] = useState<Income[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch income and accounts on mount
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [incomeData, accountsData] = await Promise.all([
        getIncomeForUser(DEMO_USER_ID),
        getAccountsForUser(DEMO_USER_ID),
      ]);
      setIncome(incomeData);
      setAccounts(accountsData.filter(a => a.is_active));
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load income sources. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitIncome(incomeData: {
    source_name: string;
    amount: number;
    frequency: IncomeFrequency;
    next_date: string;
    account_id: string | null;
    notes: string;
  }) {
    try {
      if (editingIncome) {
        // Update existing income
        const { data, error } = await supabase
          .from("income")
          .update({
            source_name: incomeData.source_name,
            amount: incomeData.amount,
            frequency: incomeData.frequency,
            next_date: incomeData.next_date,
            account_id: incomeData.account_id,
            notes: incomeData.notes || null,
          })
          .eq("id", editingIncome.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setIncome(
          income.map((inc) =>
            inc.id === editingIncome.id ? (data as Income) : inc
          )
        );
      } else {
        // Add new income
        const { data, error } = await supabase
          .from("income")
          .insert({
            user_id: DEMO_USER_ID,
            source_name: incomeData.source_name,
            amount: incomeData.amount,
            frequency: incomeData.frequency,
            next_date: incomeData.next_date,
            account_id: incomeData.account_id,
            notes: incomeData.notes || null,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;

        // Add new income to the list
        setIncome([data as Income, ...income]);
      }

      setIsModalOpen(false);
      setEditingIncome(null);
      toast.success(editingIncome ? "Income updated!" : "Income added!");
      return true;
    } catch (err) {
      console.error("Error saving income:", err);
      toast.error(
        editingIncome
          ? "Failed to update income. Please try again."
          : "Failed to add income. Please try again."
      );
      return false;
    }
  }

  async function handleToggleActive(incomeId: string, currentActive: boolean) {
    try {
      const { error } = await supabase
        .from("income")
        .update({ is_active: !currentActive })
        .eq("id", incomeId);

      if (error) throw error;

      // Update local state
      setIncome(
        income.map((inc) =>
          inc.id === incomeId ? { ...inc, is_active: !currentActive } : inc
        )
      );
      toast.success(currentActive ? "Income deactivated!" : "Income activated!");
    } catch (err) {
      console.error("Error toggling income:", err);
      toast.error("Failed to update income. Please try again.");
    }
  }

  async function handleDeleteIncome(incomeId: string) {
    if (!confirm("Are you sure you want to permanently delete this income source?")) {
      return;
    }

    try {
      const { error } = await supabase.from("income").delete().eq("id", incomeId);

      if (error) throw error;

      // Remove from local state
      setIncome(income.filter((inc) => inc.id !== incomeId));
      toast.success("Income deleted!");
    } catch (err) {
      console.error("Error deleting income:", err);
      toast.error("Failed to delete income. Please try again.");
    }
  }

  function handleOpenAddModal() {
    setEditingIncome(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(inc: Income) {
    setEditingIncome(inc);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingIncome(null);
  }

  // Filter income
  const filteredIncome = income.filter((inc) => {
    // Status filter
    if (statusFilter === "active" && !inc.is_active) return false;
    if (statusFilter === "inactive" && inc.is_active) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = inc.source_name.toLowerCase().includes(query);
      const matchesNotes = inc.notes?.toLowerCase().includes(query);
      
      return matchesName || matchesNotes;
    }

    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Income"
          subtitle="Track income sources and deposit schedules."
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
          Add Income
        </button>
      </div>

      {/* Stats */}
      {!isLoading && <IncomeStats income={income} />}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value="all">All Income Sources</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
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
              placeholder="Search income sources..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Income List */}
      <IncomeList
        income={filteredIncome}
        accounts={accounts}
        isLoading={isLoading}
        onToggleActive={handleToggleActive}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteIncome}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingIncome ? "Edit Income" : "Add New Income"}
      >
        <IncomeForm
          income={editingIncome}
          accounts={accounts}
          onSubmit={handleSubmitIncome}
        />
      </Modal>
    </div>
  );
}

