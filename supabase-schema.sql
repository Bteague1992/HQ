-- Run this in your Supabase SQL Editor to create the tables
-- This matches your actual schema with ENUMs and proper types

-- 🔧 1. Enum types (for cleaner data)

-- Enable UUID generation if needed (Supabase usually has this)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Priority for todos
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Status for todos
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');

-- Type of bill
CREATE TYPE bill_type AS ENUM (
  'utility',
  'loan',
  'credit_card',
  'subscription',
  'insurance',
  'rent_mortgage',
  'tax',
  'phone_internet',
  'other'
);

-- Bill frequency
CREATE TYPE bill_frequency AS ENUM (
  'one_time',
  'weekly',
  'biweekly',
  'monthly',
  'bimonthly',
  'quarterly',
  'semiannual',
  'annual'
);

-- Need vs want
CREATE TYPE need_want AS ENUM ('need', 'want', 'unsure');

-- Status for Teague Timber jobs
CREATE TYPE job_status AS ENUM (
  'lead',
  'quoted',
  'scheduled',
  'in_progress',
  'completed',
  'lost'
);

-- ✅ 2. todos table (for Dashboard + Todos page)

CREATE TABLE public.todos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL,  -- No auth.users reference for now

  title        text NOT NULL,
  description  text,

  category     text,
  priority     task_priority NOT NULL DEFAULT 'medium',
  status       task_status NOT NULL DEFAULT 'todo',

  due_date     date,
  scheduled_for date,

  is_active    boolean NOT NULL DEFAULT false,

  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Simple trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_todos
BEFORE UPDATE ON public.todos
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp();

-- Helpful indexes
CREATE INDEX todos_user_id_idx ON public.todos (user_id);
CREATE INDEX todos_due_date_idx ON public.todos (due_date);
CREATE INDEX todos_is_active_idx ON public.todos (is_active);
CREATE INDEX todos_status_idx ON public.todos (status);

-- ✅ 3. bills table (Bills / Due Dates page + dashboard sections)

CREATE TABLE public.bills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL,  -- No auth.users reference for now

  account_name  text NOT NULL,
  bill_type     bill_type NOT NULL DEFAULT 'other',
  need_or_want  need_want NOT NULL DEFAULT 'need',

  amount        numeric(12,2) NOT NULL,
  balance       numeric(14,2),

  due_date      date NOT NULL,
  frequency     bill_frequency NOT NULL DEFAULT 'monthly',
  autopay       boolean NOT NULL DEFAULT false,
  interest_rate numeric(5,2),

  is_active     boolean NOT NULL DEFAULT true,
  notes         text,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_timestamp_bills
BEFORE UPDATE ON public.bills
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp();

CREATE INDEX bills_user_id_idx ON public.bills (user_id);
CREATE INDEX bills_due_date_idx ON public.bills (due_date);
CREATE INDEX bills_is_active_idx ON public.bills (is_active);

-- ✅ 4. teague_jobs table (Business Page – Teague Timber)

CREATE TABLE public.teague_jobs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL,  -- No auth.users reference for now

  client_name     text NOT NULL,
  client_phone    text,
  client_email    text,

  job_description text NOT NULL,
  quote_amount    numeric(12,2),
  concerns        text,

  status          job_status NOT NULL DEFAULT 'lead',
  scheduled_date  date,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_timestamp_teague_jobs
BEFORE UPDATE ON public.teague_jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp();

CREATE INDEX teague_jobs_user_id_idx ON public.teague_jobs (user_id);
CREATE INDEX teague_jobs_status_idx ON public.teague_jobs (status);
CREATE INDEX teague_jobs_scheduled_date_idx ON public.teague_jobs (scheduled_date);

-- Enable Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE teague_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (you'll want to restrict this later with real auth)
CREATE POLICY "Allow all operations on todos for now" ON todos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on bills for now" ON bills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on teague_jobs for now" ON teague_jobs FOR ALL USING (true) WITH CHECK (true);

-- 📝 Add some sample data for testing (optional)
-- Note: Replace 'your-user-id-here' with an actual UUID from auth.users or use a test UUID

INSERT INTO todos (user_id, title, description, priority, status, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Test the Supabase integration', 'Make sure all data helpers work correctly', 'high', 'in_progress', true),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Build the dashboard', 'Create a nice overview page', 'medium', 'todo', false);

INSERT INTO bills (user_id, account_name, bill_type, need_or_want, amount, due_date, autopay) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Duke Energy', 'utility', 'need', 125.50, CURRENT_DATE + INTERVAL '15 days', true),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Verizon', 'phone_internet', 'need', 79.99, CURRENT_DATE + INTERVAL '20 days', true);

INSERT INTO teague_jobs (user_id, client_name, client_phone, job_description, status, quote_amount) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'John Smith', '555-0123', 'Deck repair and staining', 'quoted', 2500.00),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Jane Doe', '555-0456', 'Tree removal service', 'lead', NULL);

