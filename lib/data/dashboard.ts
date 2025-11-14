import { supabase } from "@/lib/supabase/client";
import { Todo, Bill, TeagueJob } from "@/types/db";

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twoWeeks = new Date(today);
  twoWeeks.setDate(today.getDate() + 14);

  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .gte("due_date", today.toISOString())
    .lte("due_date", twoWeeks.toISOString())
    .order("due_date", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Error fetching upcoming bills:", error);
    return [];
  }

  return data as Bill[];
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

