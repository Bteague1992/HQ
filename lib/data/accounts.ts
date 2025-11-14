import { supabase } from "@/lib/supabase/client";
import { Account } from "@/types/db";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export async function getAccountsForUser(userId: string = DEMO_USER_ID): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .order("account_name", { ascending: true });

  if (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }

  return data as Account[];
}

