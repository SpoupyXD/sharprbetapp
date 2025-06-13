-- Migration #003: Allow the "owner" column to be NULL
ALTER TABLE public.bookmaker_accounts
  ALTER COLUMN owner DROP NOT NULL;
