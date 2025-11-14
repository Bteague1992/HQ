-- Step 0: Create timestamp function if it doesn't exist
CREATE OR REPLACE FUNCTION public.set_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 1: Create account type enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE account_type AS ENUM (
    'checking',
    'savings',
    'credit_card',
    'investment',
    'cash',
    'loan',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create accounts table (skip if exists)
CREATE TABLE IF NOT EXISTS public.accounts (
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

-- Step 3: Add trigger for accounts updated_at
CREATE TRIGGER set_timestamp_accounts
BEFORE UPDATE ON public.accounts
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp();

-- Step 4: Add indexes for accounts (skip if exists)
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON public.accounts (user_id);
CREATE INDEX IF NOT EXISTS accounts_is_active_idx ON public.accounts (is_active);
CREATE INDEX IF NOT EXISTS accounts_account_type_idx ON public.accounts (account_type);

-- Step 5: Create income frequency enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE income_frequency AS ENUM (
    'one_time',
    'weekly',
    'biweekly',
    'monthly',
    'bimonthly',
    'quarterly',
    'annual'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 6: Create income table (skip if exists)
CREATE TABLE IF NOT EXISTS public.income (
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

-- Step 7: Add trigger for income updated_at
CREATE TRIGGER set_timestamp_income
BEFORE UPDATE ON public.income
FOR EACH ROW
EXECUTE FUNCTION public.set_timestamp();

-- Step 8: Add indexes for income (skip if exists)
CREATE INDEX IF NOT EXISTS income_user_id_idx ON public.income (user_id);
CREATE INDEX IF NOT EXISTS income_is_active_idx ON public.income (is_active);
CREATE INDEX IF NOT EXISTS income_next_date_idx ON public.income (next_date);
CREATE INDEX IF NOT EXISTS income_account_id_idx ON public.income (account_id);

-- Step 9: Add account_id column to bills table (skip if exists)
DO $$ BEGIN
  ALTER TABLE public.bills ADD COLUMN account_id uuid;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Step 10: Add foreign key constraint to bills.account_id (skip if exists)
DO $$ BEGIN
  ALTER TABLE public.bills
  ADD CONSTRAINT bills_account_id_fkey 
  FOREIGN KEY (account_id) 
  REFERENCES public.accounts(id) 
  ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 11: Add index for bills.account_id (skip if exists)
CREATE INDEX IF NOT EXISTS bills_account_id_idx ON public.bills (account_id);

