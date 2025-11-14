// Helper functions for calculating bill due dates

import { BillFrequency } from "@/types/db";

/**
 * Calculate the next due date based on current due date and frequency
 */
export function getNextDueDate(
  currentDueDate: Date,
  frequency: BillFrequency
): Date {
  const next = new Date(currentDueDate);

  switch (frequency) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "biweekly":
      next.setDate(next.getDate() + 14);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "bimonthly":
      next.setMonth(next.getMonth() + 2);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "semiannual":
      next.setMonth(next.getMonth() + 6);
      break;
    case "annual":
      next.setFullYear(next.getFullYear() + 1);
      break;
    case "one_time":
      // Don't advance, one-time bills don't recur
      break;
  }

  return next;
}

/**
 * Get the actual due date for a bill
 */
export function getBillDueDate(bill: { due_date: string }): Date {
  return new Date(bill.due_date);
}

/**
 * Get days until a bill is due
 */
export function getDaysUntilDue(dueDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a bill is recurring (not one-time)
 */
export function isRecurringBill(bill: { frequency: BillFrequency }): boolean {
  return bill.frequency !== "one_time";
}

/**
 * Get a human-readable label for the frequency
 */
export function getFrequencyLabel(frequency: BillFrequency): string {
  const labels: Record<BillFrequency, string> = {
    one_time: "One-time",
    weekly: "Weekly",
    biweekly: "Bi-weekly",
    monthly: "Monthly",
    bimonthly: "Bi-monthly",
    quarterly: "Quarterly",
    semiannual: "Semi-annual",
    annual: "Annual",
  };
  return labels[frequency];
}
