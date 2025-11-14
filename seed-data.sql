-- Seed data for testing HQ app
-- Run this in Supabase SQL Editor after creating the tables
-- Uses test user_id: 550e8400-e29b-41d4-a716-446655440000

-- Clear existing test data (optional)
DELETE FROM todos WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
DELETE FROM bills WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
DELETE FROM teague_jobs WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;

-- ============================================
-- TODOS - Mix of active/inactive, different priorities and categories
-- ============================================

INSERT INTO todos (user_id, title, description, category, priority, status, due_date, scheduled_for, is_active) VALUES
  -- Active/Today's tasks
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Call insurance about truck coverage', 
   'Need to update policy and check deductible options', 
   'money', 'high', 'todo', CURRENT_DATE, CURRENT_DATE, true),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Pick up prescription for Fluffy', 
   'Vet said it would be ready after 2pm', 
   'fluffy', 'high', 'todo', CURRENT_DATE, CURRENT_DATE, true),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Review quotes for deck materials', 
   'Compare prices at Home Depot vs local lumber yard', 
   'teague', 'medium', 'in_progress', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE, true),

  -- Upcoming tasks (not active yet)
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'File quarterly taxes', 
   'Gather receipts and fill out forms', 
   'legal', 'high', 'todo', CURRENT_DATE + INTERVAL '10 days', NULL, false),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Schedule annual HVAC maintenance', 
   'Haven''t had system checked in over a year', 
   'home', 'medium', 'todo', CURRENT_DATE + INTERVAL '15 days', NULL, false),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Research new chainsaw models', 
   'Current one is getting worn out, need something with better power', 
   'teague', 'medium', 'todo', CURRENT_DATE + INTERVAL '30 days', NULL, false),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Update business insurance policy', 
   'Annual renewal coming up', 
   'teague', 'high', 'todo', CURRENT_DATE + INTERVAL '20 days', NULL, false),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Fix leaky kitchen faucet', 
   'Drip has been getting worse', 
   'home', 'low', 'todo', NULL, NULL, false),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Plan grocery shopping list', 
   'Stock up on basics for the week', 
   NULL, 'low', 'todo', CURRENT_DATE + INTERVAL '3 days', NULL, false),

  -- Completed tasks
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Oil change for work truck', 
   'Done at Quick Lube on Main St', 
   'teague', 'medium', 'done', CURRENT_DATE - INTERVAL '2 days', NULL, false);

-- ============================================
-- BILLS - Mix of utilities, loans, subscriptions
-- ============================================

INSERT INTO bills (user_id, account_name, bill_type, need_or_want, amount, balance, due_date, frequency, autopay, interest_rate, notes) VALUES
  -- Utilities (autopay, monthly)
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Duke Energy', 'utility', 'need', 
   145.75, NULL, CURRENT_DATE + INTERVAL '8 days', 'monthly', true, NULL, 
   'Electric bill - usually higher in summer'),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Verizon Wireless', 'phone_internet', 'need', 
   89.99, NULL, CURRENT_DATE + INTERVAL '12 days', 'monthly', true, NULL, 
   'Phone plan with unlimited data'),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Spectrum Internet', 'phone_internet', 'need', 
   79.99, NULL, CURRENT_DATE + INTERVAL '5 days', 'monthly', true, NULL, 
   'High-speed internet'),

  -- Loans (with balances and interest, monthly)
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Ford F-150 Truck Loan', 'loan', 'need', 
   425.00, 18500.00, CURRENT_DATE + INTERVAL '18 days', 'monthly', false, 4.99, 
   'Work truck - 36 months remaining'),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Home Equity Line', 'loan', 'need', 
   275.00, 32000.00, CURRENT_DATE + INTERVAL '25 days', 'monthly', false, 6.75, 
   'Used for home improvements'),

  -- Credit Cards (monthly)
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Chase Freedom Card', 'credit_card', 'unsure', 
   85.00, 1250.00, CURRENT_DATE + INTERVAL '15 days', 'monthly', false, 18.99, 
   'Trying to pay this down'),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Lowe''s Business Card', 'credit_card', 'need', 
   150.00, 3400.00, CURRENT_DATE + INTERVAL '20 days', 'monthly', false, 24.99, 
   'For equipment and materials - interest free for 12 months'),

  -- Insurance (semi-annual)
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'State Farm Auto Insurance', 'insurance', 'need', 
   600.00, NULL, CURRENT_DATE + INTERVAL '28 days', 'semiannual', false, NULL, 
   'Truck and personal vehicle - paid every 6 months'),
  
  -- Insurance (annual)
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Teague Timber Liability Insurance', 'insurance', 'need', 
   2400.00, NULL, CURRENT_DATE + INTERVAL '60 days', 'annual', false, NULL, 
   'Business liability coverage - annual payment'),

  -- Subscriptions (monthly)
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'YouTube Premium', 'subscription', 'want', 
   13.99, NULL, CURRENT_DATE + INTERVAL '3 days', 'monthly', true, NULL, 
   'Ad-free videos'),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Netflix', 'subscription', 'want', 
   15.49, NULL, CURRENT_DATE + INTERVAL '7 days', 'monthly', true, NULL, 
   'Standard plan'),

  -- Weekly subscription
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Lawn Service', 'other', 'want', 
   45.00, NULL, CURRENT_DATE + INTERVAL '4 days', 'weekly', false, NULL, 
   'Weekly mowing during summer'),

  -- Taxes (quarterly)
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Quarterly Estimated Taxes', 'tax', 'need', 
   850.00, NULL, CURRENT_DATE + INTERVAL '45 days', 'quarterly', false, NULL, 
   'Q4 payment for business income'),

  -- One-time payment
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Property Tax', 'tax', 'need', 
   1850.00, NULL, CURRENT_DATE + INTERVAL '90 days', 'one_time', false, NULL, 
   'Annual property tax payment');

-- ============================================
-- TEAGUE JOBS - Tree service jobs at various stages
-- ============================================

INSERT INTO teague_jobs (user_id, client_name, client_phone, client_email, job_description, quote_amount, concerns, status, scheduled_date) VALUES
  -- Active leads
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Sarah Mitchell', '336-555-0123', 'sarah.mitchell@email.com',
   'Large oak tree removal - close to house, needs careful planning',
   NULL, 'Tree is leaning toward house, power lines nearby', 
   'lead', NULL),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Bob Williams', '336-555-0456', NULL,
   'Storm damage cleanup - several branches down in backyard',
   NULL, 'Has two dogs, need to be careful with gate', 
   'lead', NULL),

  -- Quoted jobs
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Henderson HOA', '336-555-0789', 'maintenance@hendersonhoa.com',
   'Trim trees along main entrance road - about 15 trees',
   3200.00, 'High visibility job, need to work around traffic', 
   'quoted', NULL),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Jennifer Garcia', '336-555-0234', 'jgarcia@email.com',
   'Remove two dead pine trees and grind stumps',
   1800.00, 'One tree is near pool fence, soft ground from recent rain', 
   'quoted', NULL),

  -- Scheduled jobs
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Mike Thompson', '336-555-0567', 'mthompson@email.com',
   'Trim oak trees (3) and remove one small dead maple',
   950.00, NULL, 
   'scheduled', CURRENT_DATE + INTERVAL '3 days'),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Riverside Church', '336-555-0890', 'office@riversidechurch.org',
   'Remove fallen tree from parking lot after storm',
   1200.00, 'Need to work around Sunday service schedule', 
   'scheduled', CURRENT_DATE + INTERVAL '5 days'),

  -- In progress
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'David Chen', '336-555-0345', 'davidchen@email.com',
   'Full tree service - trim 6 trees, remove 2, stump grinding',
   4500.00, 'Large property, multi-day job', 
   'in_progress', CURRENT_DATE),

  -- Completed
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Linda Brown', '336-555-0678', 'lbrown@email.com',
   'Emergency tree removal after it fell on shed',
   2100.00, 'Insurance job, needed quick turnaround', 
   'completed', CURRENT_DATE - INTERVAL '5 days'),
  
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'James Wilson', '336-555-0901', NULL,
   'Routine trimming of three large oaks',
   850.00, 'Regular customer - annual service', 
   'completed', CURRENT_DATE - INTERVAL '10 days'),

  -- Lost
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 
   'Karen Davis', '336-555-0432', 'kdavis@email.com',
   'Tree removal and landscaping',
   3800.00, 'Wanted lower price than quote', 
   'lost', NULL);

-- Verify the data
SELECT 'Todos created:' as info, COUNT(*) as count FROM todos WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
UNION ALL
SELECT 'Bills created:', COUNT(*) FROM bills WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
UNION ALL
SELECT 'Jobs created:', COUNT(*) FROM teague_jobs WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;

