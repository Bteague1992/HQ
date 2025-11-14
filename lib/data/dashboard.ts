import { supabase } from "@/lib/supabase/client";
import { Todo, Bill, TeagueJob } from "@/types/db";
import { getBillDueDate, getDaysUntilDue } from "@/lib/utils/billDates";

// Temporary demo user ID - will be replaced with real auth later
const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export async function getActiveTodos(
  userId: string = DEMO_USER_ID
): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .neq("status", "done")
    .eq("is_active", true)
    .order("priority", { ascending: false }) // high priority first
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching active todos:", error);
    return [];
  }

  return data as Todo[];
}

export async function getThisWeekTodos(
  userId: string = DEMO_USER_ID
): Promise<Todo[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .neq("status", "done")
    .gte("due_date", today.toISOString())
    .lte("due_date", nextWeek.toISOString())
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching this week's todos:", error);
    return [];
  }

  return data as Todo[];
}

export async function getUpcomingBills(
  userId: string = DEMO_USER_ID
): Promise<Bill[]> {
  // Fetch all active bills (both recurring and one-time)
  // Can't filter recurring bills by due_date in SQL, so we fetch all and filter in JS
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching upcoming bills:", error);
    return [];
  }

  // Calculate next due date for each bill (handles both types)
  // - Recurring bills (due_day_of_month): calculates next occurrence
  // - One-time bills (due_date): uses the specific date
  const bills = (data as Bill[])
    .map((bill) => ({
      ...bill,
      _nextDueDate: getBillDueDate(bill),
    }))
    .filter((bill) => {
      const daysUntil = getDaysUntilDue(bill._nextDueDate);
      return daysUntil >= 0 && daysUntil <= 14;
    })
    .sort((a, b) => a._nextDueDate.getTime() - b._nextDueDate.getTime())
    .slice(0, 10);

  // Remove the temporary _nextDueDate property
  return bills.map(({ _nextDueDate, ...bill }) => bill);
}

export async function getPendingJobs(
  userId: string = DEMO_USER_ID
): Promise<TeagueJob[]> {
  const { data, error } = await supabase
    .from("teague_jobs")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["lead", "quoted", "scheduled", "in_progress"])
    .order("scheduled_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending jobs:", error);
    return [];
  }

  return data as TeagueJob[];
}

