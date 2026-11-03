-- Adds Credit card as an expense type.
-- Run this in the Supabase SQL editor.

alter type public.expense_kind add value if not exists 'CREDIT_CARD';
