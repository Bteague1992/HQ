"use client";

import { useEffect, useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import { getBillsForUser } from "@/lib/data/bills";
import { supabase } from "@/lib/supabase/client";
import { Bill, BillType, NeedWant } from "@/types/db";
import BillForm from "@/components/BillForm";
import BillList from "@/components/BillList";
import BillFilters from "@/components/BillFilters";
import BillStats from "@/components/BillStats";
import Modal from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function BillsPage() {
  const toast = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "archived"
  >("all");
  const [typeFilter, setTypeFilter] = useState<BillType | "all">("all");
  const [needWantFilter, setNeedWantFilter] = useState<NeedWant | "all">("all");
  const [urgencyFilter, setUrgencyFilter] = useState<
    "all" | "overdue" | "soon" | "normal"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch bills on mount
  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    setIsLoading(true);
    try {
      const data = await getBillsForUser(DEMO_USER_ID);
      // Sort by due_date ascending
      const sorted = data.sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      );
      setBills(sorted);
    } catch (err) {
      console.error("Error fetching bills:", err);
      toast.error("Failed to load bills. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmitBill(billData: {
    account_name: string;
    bill_type: BillType;
    need_or_want: NeedWant;
    amount: number;
    balance: number | null;
    due_date: string;
    frequency: string;
    autopay: boolean;
    interest_rate: number | null;
    notes: string;
  }) {
    try {
      if (editingBill) {
        // Update existing bill
        const { data, error } = await supabase
          .from("bills")
          .update({
            account_name: billData.account_name,
            bill_type: billData.bill_type,
            need_or_want: billData.need_or_want,
            amount: billData.amount,
            balance: billData.balance,
            due_date: billData.due_date,
            frequency: billData.frequency,
            autopay: billData.autopay,
            interest_rate: billData.interest_rate,
            notes: billData.notes || null,
          })
          .eq("id", editingBill.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setBills(
          bills
            .map((bill) => (bill.id === editingBill.id ? (data as Bill) : bill))
            .sort(
              (a, b) =>
                new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
            )
        );
      } else {
        // Add new bill
        const { data, error } = await supabase
          .from("bills")
          .insert({
            user_id: DEMO_USER_ID,
            account_name: billData.account_name,
            bill_type: billData.bill_type,
            need_or_want: billData.need_or_want,
            amount: billData.amount,
            balance: billData.balance,
            due_date: billData.due_date,
            frequency: billData.frequency,
            autopay: billData.autopay,
            interest_rate: billData.interest_rate,
            notes: billData.notes || null,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;

        // Add new bill and re-sort
        const newBills = [data as Bill, ...bills].sort(
          (a, b) =>
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        );
        setBills(newBills);
      }

      setIsModalOpen(false);
      setEditingBill(null);
      toast.success(editingBill ? "Bill updated!" : "Bill added!");
      return true;
    } catch (err) {
      console.error("Error saving bill:", err);
      toast.error(
        editingBill
          ? "Failed to update bill. Please try again."
          : "Failed to add bill. Please try again."
      );
      return false;
    }
  }

  async function handleArchiveBill(billId: string) {
    try {
      const { error } = await supabase
        .from("bills")
        .update({ is_active: false })
        .eq("id", billId);

      if (error) throw error;

      // Update local state
      setBills(
        bills.map((bill) =>
          bill.id === billId ? { ...bill, is_active: false } : bill
        )
      );
      toast.success("Bill archived!");
    } catch (err) {
      console.error("Error archiving bill:", err);
      toast.error("Failed to archive bill. Please try again.");
    }
  }

  async function handleRestoreBill(billId: string) {
    try {
      const { error } = await supabase
        .from("bills")
        .update({ is_active: true })
        .eq("id", billId);

      if (error) throw error;

      // Update local state
      setBills(
        bills.map((bill) =>
          bill.id === billId ? { ...bill, is_active: true } : bill
        )
      );
      toast.success("Bill restored!");
    } catch (err) {
      console.error("Error restoring bill:", err);
      toast.error("Failed to restore bill. Please try again.");
    }
  }

  async function handleDeleteBill(billId: string) {
    if (!confirm("Are you sure you want to permanently delete this bill?")) {
      return;
    }

    try {
      const { error } = await supabase.from("bills").delete().eq("id", billId);

      if (error) throw error;

      // Remove from local state
      setBills(bills.filter((bill) => bill.id !== billId));
      toast.success("Bill deleted!");
    } catch (err) {
      console.error("Error deleting bill:", err);
      toast.error("Failed to delete bill. Please try again.");
    }
  }

  // Helper function to determine bill urgency
  function getUrgency(dueDate: string): "overdue" | "soon" | "normal" {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (diffDays <= 3) return "soon";
    return "normal";
  }

  // Filter bills based on all active filters
  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      // Status filter
      if (statusFilter === "active" && !bill.is_active) return false;
      if (statusFilter === "archived" && bill.is_active) return false;

      // Type filter
      if (typeFilter !== "all" && bill.bill_type !== typeFilter) return false;

      // Need/Want filter
      if (needWantFilter !== "all" && bill.need_or_want !== needWantFilter)
        return false;

      // Urgency filter
      if (urgencyFilter !== "all") {
        const urgency = getUrgency(bill.due_date);
        if (urgency !== urgencyFilter) return false;
      }

      // Search query (account name)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!bill.account_name.toLowerCase().includes(query)) return false;
      }

      return true;
    });
  }, [
    bills,
    statusFilter,
    typeFilter,
    needWantFilter,
    urgencyFilter,
    searchQuery,
  ]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (typeFilter !== "all") count++;
    if (needWantFilter !== "all") count++;
    if (urgencyFilter !== "all") count++;
    if (searchQuery) count++;
    return count;
  }, [statusFilter, typeFilter, needWantFilter, urgencyFilter, searchQuery]);

  function handleClearFilters() {
    setStatusFilter("all");
    setTypeFilter("all");
    setNeedWantFilter("all");
    setUrgencyFilter("all");
    setSearchQuery("");
  }

  function handleOpenAddModal() {
    setEditingBill(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(bill: Bill) {
    setEditingBill(bill);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingBill(null);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <PageHeader
            title="Bills & Due Dates"
            subtitle="See what's coming and avoid surprises."
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex-shrink-0"
        >
          + Add Bill
        </button>
      </div>

      {/* Stats Row */}
      <BillStats bills={bills} />

      {/* Filters */}
      <BillFilters
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        needWantFilter={needWantFilter}
        urgencyFilter={urgencyFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        onNeedWantChange={setNeedWantFilter}
        onUrgencyChange={setUrgencyFilter}
        onSearchChange={setSearchQuery}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Bills List */}
      <BillList
        bills={filteredBills}
        isLoading={isLoading}
        onArchive={handleArchiveBill}
        onRestore={handleRestoreBill}
        onDelete={handleDeleteBill}
        onEdit={handleOpenEditModal}
      />

      {/* Add/Edit Bill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBill ? "Edit Bill" : "Add New Bill"}
      >
        <BillForm bill={editingBill} onSubmit={handleSubmitBill} />
      </Modal>
    </div>
  );
}
