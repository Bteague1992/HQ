"use client";

import { Bill } from "@/types/db";
import {
  getBillDueDate,
  getDaysUntilDue,
  isRecurringBill,
  getFrequencyLabel,
} from "@/lib/utils/billDates";

interface BillListProps {
  bills: Bill[];
  isLoading: boolean;
  onArchive: (billId: string) => void;
  onRestore: (billId: string) => void;
  onDelete: (billId: string) => void;
}

export default function BillList({
  bills,
  isLoading,
  onArchive,
  onRestore,
  onDelete,
}: BillListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">All Bills</h2>
        <p className="text-gray-500 text-center py-8">Loading bills...</p>
      </div>
    );
  }

  if (bills.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">All Bills</h2>
        <p className="text-gray-500 text-center py-8">
          No bills match your filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  const needWantColors = {
    need: "bg-red-100 text-red-800",
    want: "bg-green-100 text-green-800",
    unsure: "bg-gray-100 text-gray-700",
  };

  const billTypeLabels = {
    utility: "Utility",
    loan: "Loan",
    credit_card: "Credit Card",
    subscription: "Subscription",
    insurance: "Insurance",
    rent_mortgage: "Rent/Mortgage",
    tax: "Tax",
    phone_internet: "Phone/Internet",
    other: "Other",
  };

  // Helper function to determine if a bill is urgent
  function getUrgency(bill: Bill): "overdue" | "soon" | "normal" {
    const dueDate = getBillDueDate(bill);
    const daysUntil = getDaysUntilDue(dueDate);

    if (daysUntil < 0) return "overdue";
    if (daysUntil <= 3) return "soon";
    return "normal";
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">All Bills ({bills.length})</h2>
      <div className="space-y-3">
        {bills.map((bill) => {
          const urgency = getUrgency(bill);
          const dueDate = getBillDueDate(bill);
          const isRecurring = isRecurringBill(bill);
          const urgencyStyles = {
            overdue: "border-l-4 border-red-500 bg-red-50",
            soon: "border-l-4 border-amber-500 bg-amber-50",
            normal: "border border-gray-200",
          };

          return (
            <div
              key={bill.id}
              className={`rounded-xl p-4 hover:shadow-md transition-shadow ${
                urgencyStyles[urgency]
              } ${!bill.is_active ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {bill.account_name}
                    </h3>
                    {!bill.is_active && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded">
                        Archived
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                      {getFrequencyLabel(bill.frequency)}
                    </span>
                    {bill.autopay && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        Autopay
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {billTypeLabels[bill.bill_type]}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        needWantColors[bill.need_or_want]
                      }`}
                    >
                      {bill.need_or_want.charAt(0).toUpperCase() +
                        bill.need_or_want.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(bill.amount)}
                      </span>
                      {bill.balance && (
                        <span className="text-xs ml-1">
                          (Balance: {formatCurrency(bill.balance)})
                        </span>
                      )}
                    </div>
                    <div
                      className={`font-medium ${
                        urgency === "overdue"
                          ? "text-red-700"
                          : urgency === "soon"
                          ? "text-amber-700"
                          : "text-gray-700"
                      }`}
                    >
                      Due: {formatDate(dueDate.toISOString())}
                      {urgency === "overdue" && " ⚠️"}
                      {urgency === "soon" && " 🔔"}
                    </div>
                    {bill.interest_rate && (
                      <span className="text-xs">
                        {bill.interest_rate}% APR
                      </span>
                    )}
                  </div>

                  {bill.notes && (
                    <p className="text-xs text-gray-600 mt-2 italic">
                      {bill.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {bill.is_active ? (
                    <button
                      onClick={() => onArchive(bill.id)}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => onRestore(bill.id)}
                      className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                    >
                      Restore
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(bill.id)}
                    className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

