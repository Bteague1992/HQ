-- RUN EACH BLOCK SEPARATELY IN SUPABASE SQL EDITOR
-- Copy and paste each block one at a time, run it, then move to the next

-- ========================================
-- BLOCK 1: Create account_type enum
-- ========================================
CREATE TYPE account_type AS ENUM (
  'checking',
  'savings',
  'credit_card',
  'investment',
  'cash',
  'loan',
  'other'
);


-- ========================================
-- BLOCK 2: Create accounts table
-- ========================================
CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  account_name text NOT NULL,
  account_type account_type NOT NULL DEFAULT 'checking',
  current_balance numeric(14,2) NOT NULL DEFAULT 0,
  institution_name text,
  account_number_last4 text,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);


-- ========================================
-- BLOCK 3: Create income_frequency enum
-- ========================================
CREATE TYPE income_frequency AS ENUM (
  'one_time',
  'weekly',
  'biweekly',
  'monthly',
  'bimonthly',
  'quarterly',
  'annual'
);


-- ========================================
-- BLOCK 4: Create income table
-- ========================================
CREATE TABLE public.income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  source_name text NOT NULL,
  amount numeric(12,2) NOT NULL,
  frequency income_frequency NOT NULL DEFAULT 'monthly',
  next_date date NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);


-- ========================================
-- BLOCK 5: Add account_id to bills
-- ========================================
ALTER TABLE public.bills ADD COLUMN account_id uuid;


-- ========================================
-- BLOCK 6: Add foreign key
-- ========================================
ALTER TABLE public.bills
ADD CONSTRAINT bills_account_id_fkey 
FOREIGN KEY (account_id) 
REFERENCES public.accounts(id) 
ON DELETE SET NULL;


-- ========================================
-- BLOCK 7: Create indexes
-- ========================================
CREATE INDEX accounts_user_id_idx ON public.accounts (user_id);
CREATE INDEX accounts_is_active_idx ON public.accounts (is_active);
CREATE INDEX income_user_id_idx ON public.income (user_id);
CREATE INDEX income_account_id_idx ON public.income (account_id);
CREATE INDEX bills_account_id_idx ON public.bills (account_id);

