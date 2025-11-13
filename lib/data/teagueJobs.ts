import { supabase } from "@/lib/supabase/client";
import { TeagueJob } from "@/types/db";

// Temporary demo user ID (UUID) - will be replaced with real auth later
// Make sure this matches the user_id in your test data
const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export async function getTeagueJobsForUser(
  userId: string = DEMO_USER_ID
): Promise<TeagueJob[]> {
  const { data, error } = await supabase
    .from("teague_jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching Teague jobs:", error);
    return [];
  }

  return data as TeagueJob[];
}

