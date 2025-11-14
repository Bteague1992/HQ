import { supabase } from "@/lib/supabase/client";
import { Income } from "@/types/db";
import { getNextDueDate } from "@/lib/utils/billDates";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export async function getIncomeForUser(userId: string = DEMO_USER_ID): Promise<Income[]> {
  const { data, error } = await supabase
    .from("income")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching income:", error);
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updatedIncome: Income[] = [];
  for (const income of data as Income[]) {
    let currentIncome = { ...income };
    let nextDate = new Date(currentIncome.next_date);
    nextDate.setHours(0, 0, 0, 0);

    // Auto-advance next date for recurring income if it's in the past
    if (nextDate < today && currentIncome.frequency !== 'one_time') {
      let newNextDate = getNextDueDate(nextDate, currentIncome.frequency as any);
      
      // Keep advancing until it's in the future
      while (newNextDate < today) {
        newNextDate = getNextDueDate(newNextDate, currentIncome.frequency as any);
      }

      const { error: updateError } = await supabase
        .from("income")
        .update({ next_date: newNextDate.toISOString().split('T')[0] })
        .eq("id", currentIncome.id);

      if (updateError) {
        console.error(`Error auto-advancing income ${currentIncome.id}:`, updateError);
      } else {
        currentIncome = { ...currentIncome, next_date: newNextDate.toISOString().split('T')[0] };
      }
    }
    updatedIncome.push(currentIncome);
  }

  return updatedIncome;
}

