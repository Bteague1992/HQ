import { supabase } from "@/lib/supabase/client";
import { Todo } from "@/types/db";

// Temporary demo user ID (UUID) - will be replaced with real auth later
// Make sure this matches the user_id in your test data
const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export async function getTodosForUser(
  userId: string = DEMO_USER_ID
): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching todos:", error);
    return [];
  }

  return data as Todo[];
}
