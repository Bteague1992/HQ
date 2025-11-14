"use client";

import { Bill } from "@/types/db";
import Link from "next/link";
import {
  getBillDueDate,
  getDaysUntilDue,
  isRecurringBill,
  getFrequencyLabel,
} from "@/lib/utils/billDates";

interface UpcomingBillsProps {
  bills: Bill[];
}

export default function UpcomingBills({ bills }: UpcomingBillsProps) {

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  if (bills.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Bills</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3">No bills due in the next 14 days.</p>
          <Link
            href="/bills"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View all bills →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Upcoming Bills</h2>
        <span className="text-sm text-gray-500">Next 14 days</span>
      </div>
      <div className="space-y-3">
        {bills.map((bill) => {
          const dueDate = getBillDueDate(bill);
          const daysUntil = getDaysUntilDue(dueDate);
          const isUrgent = daysUntil <= 3;
          const isRecurring = isRecurringBill(bill);

          return (
            <div
              key={bill.id}
              className={`p-3 rounded-lg border-l-4 ${
                isUrgent
                  ? "border-red-500 bg-red-50"
                  : "border-blue-500 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">
                    {bill.account_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span
                      className={`font-semibold ${
                        isUrgent ? "text-red-700" : "text-gray-700"
                      }`}
                    >
                      {daysUntil === 0
                        ? "Due today"
                        : daysUntil === 1
                        ? "Due tomorrow"
                        : `Due in ${daysUntil} days`}
                    </span>
                    {isRecurring && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                        {getFrequencyLabel(bill.frequency)}
                      </span>
                    )}
                    {bill.autopay && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        Autopay
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(bill.amount)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {dueDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Link
        href="/bills"
        className="block mt-4 text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        View all bills →
      </Link>
    </div>
  );
}

