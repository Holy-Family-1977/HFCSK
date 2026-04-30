-- =============================================================================
-- Link public.profiles to auth.users (run in Supabase SQL Editor)
-- profiles.id MUST match auth.users.id — if you hardcode a UUID that does not exist
-- in THIS project’s auth.users, you get: ERROR 23503 (foreign key violation).
-- =============================================================================

-- 1) Confirm the user exists in THIS project (same URL as your .env NEXT_PUBLIC_SUPABASE_URL):
-- SELECT id, email, created_at FROM auth.users WHERE email = 'admin@gmail.com';

-- 2) Upsert profile by reading id + email from auth (no manual UUID — avoids FK errors):
INSERT INTO public.profiles (id, email, role)
SELECT
  u.id,
  u.email,
  'admin'::public.app_role
FROM auth.users AS u
WHERE u.email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role;

-- To make this user super_admin instead (only one super_admin allowed in the schema):
-- INSERT INTO public.profiles (id, email, role)
-- SELECT u.id, u.email, 'super_admin'::public.app_role
-- FROM auth.users AS u
-- WHERE u.email = 'admin@gmail.com'
-- ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, role = EXCLUDED.role;

-- If the INSERT inserts 0 rows, the email is not in auth.users — create the user under
-- Authentication → Users first, or fix the email in the WHERE clause.
