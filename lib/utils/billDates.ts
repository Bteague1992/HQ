// Helper functions for calculating bill due dates

/**
 * Get the next due date for a recurring bill based on day of month
 */
export function getNextDueDate(dayOfMonth: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Try this month first
  let nextDate = new Date(currentYear, currentMonth, dayOfMonth);
  
  // If date already passed this month, use next month
  if (nextDate <= today) {
    nextDate = new Date(currentYear, currentMonth + 1, dayOfMonth);
  }
  
  // Handle edge cases (e.g., day 31 in months with 30 days)
  // If the day doesn't exist in the target month, use last day of that month
  const targetMonth = nextDate.getMonth();
  const actualMonth = new Date(nextDate.getFullYear(), targetMonth + 1, 0).getMonth();
  
  if (nextDate.getDate() !== dayOfMonth) {
    // Day doesn't exist in this month, use last day
    nextDate = new Date(nextDate.getFullYear(), targetMonth + 1, 0);
  }
  
  return nextDate;
}

/**
 * Get the actual due date for a bill (handles both recurring and one-time)
 */
export function getBillDueDate(bill: {
  due_date: string | null;
  due_day_of_month: number | null;
}): Date {
  if (bill.due_day_of_month !== null) {
    // Recurring bill
    return getNextDueDate(bill.due_day_of_month);
  } else if (bill.due_date) {
    // One-time bill
    return new Date(bill.due_date);
  } else {
    // Fallback (shouldn't happen)
    return new Date();
  }
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
 * Check if a bill is recurring
 */
export function isRecurringBill(bill: {
  due_day_of_month: number | null;
}): boolean {
  return bill.due_day_of_month !== null;
}

