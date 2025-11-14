// Enum types matching your Supabase schema
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";
export type BillType =
  | "utility"
  | "loan"
  | "credit_card"
  | "subscription"
  | "insurance"
  | "rent_mortgage"
  | "tax"
  | "phone_internet"
  | "other";
export type NeedWant = "need" | "want" | "unsure";
export type JobStatus =
  | "lead"
  | "quoted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "lost";

export type BillFrequency =
  | 'one_time'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'bimonthly'
  | 'quarterly'
  | 'semiannual'
  | 'annual';

export type AccountType = 
  | 'checking'
  | 'savings'
  | 'credit_card'
  | 'investment'
  | 'cash'
  | 'loan'
  | 'other';

export type IncomeFrequency = 
  | 'one_time'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'bimonthly'
  | 'quarterly'
  | 'annual';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null; // date
  scheduled_for: string | null; // date
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Bill {
  id: string;
  user_id: string;
  account_name: string;
  bill_type: BillType;
  need_or_want: NeedWant;
  amount: number; // numeric in DB
  balance: number | null; // numeric in DB
  due_date: string; // Next due date (always set)
  frequency: BillFrequency; // How often bill recurs
  autopay: boolean;
  interest_rate: number | null; // numeric in DB
  is_active: boolean;
  notes: string | null;
  account_id: string | null; // NEW: Link to account
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_name: string;
  account_type: AccountType;
  current_balance: number;
  institution_name: string | null;
  account_number_last4: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Income {
  id: string;
  user_id: string;
  source_name: string;
  amount: number;
  frequency: IncomeFrequency;
  next_date: string;
  account_id: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeagueJob {
  id: string;
  user_id: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  job_description: string;
  quote_amount: number | null; // numeric in DB
  concerns: string | null;
  status: JobStatus;
  scheduled_date: string | null; // date
  created_at: string;
  updated_at: string;
}

