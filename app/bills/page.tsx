"use client";

import { useEffect, useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import { getBillsForUser } from "@/lib/data/bills";
import { supabase } from "@/lib/supabase/client";
import { Bill, BillType, NeedWant } from "@/types/db";
import BillForm from "@/components/BillForm";
import BillList from "@/components/BillList";
import BillFilters from "@/components/BillFilters";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

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
    setError("");
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
      setError("Failed to load bills. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddBill(billData: {
    account_name: string;
    bill_type: BillType;
    need_or_want: NeedWant;
    amount: number;
    balance: number | null;
    due_date: string;
    autopay: boolean;
    interest_rate: number | null;
    notes: string;
  }) {
    try {
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
      return true;
    } catch (err) {
      console.error("Error adding bill:", err);
      setError("Failed to add bill. Please try again.");
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
    } catch (err) {
      console.error("Error archiving bill:", err);
      setError("Failed to archive bill. Please try again.");
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
    } catch (err) {
      console.error("Error restoring bill:", err);
      setError("Failed to restore bill. Please try again.");
    }
  }

  async function handleDeleteBill(billId: string) {
    if (!confirm("Are you sure you want to permanently delete this bill?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("bills")
        .delete()
        .eq("id", billId);

      if (error) throw error;

      // Remove from local state
      setBills(bills.filter((bill) => bill.id !== billId));
    } catch (err) {
      console.error("Error deleting bill:", err);
      setError("Failed to delete bill. Please try again.");
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
  }, [bills, statusFilter, typeFilter, needWantFilter, urgencyFilter, searchQuery]);

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

  return (
    <div>
      <PageHeader
        title="Bills & Due Dates"
        subtitle="See what's coming and avoid surprises."
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[2fr,3fr] gap-6">
        {/* Left column: Add Bill form */}
        <BillForm onAdd={handleAddBill} />

        {/* Right column: Bills list with filters */}
        <div>
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
          <BillList
            bills={filteredBills}
            isLoading={isLoading}
            onArchive={handleArchiveBill}
            onRestore={handleRestoreBill}
            onDelete={handleDeleteBill}
          />
        </div>
      </div>
    </div>
  );
}
