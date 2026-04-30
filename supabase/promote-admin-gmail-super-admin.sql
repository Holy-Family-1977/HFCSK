-- =============================================================================
-- Make admin@gmail.com the only super_admin (schema allows one super_admin).
-- Run in Supabase SQL Editor.
-- =============================================================================

-- Demote any current super_admin so the partial unique index allows a new one.
UPDATE public.profiles
SET role = 'admin'::public.app_role
WHERE role = 'super_admin'::public.app_role;

INSERT INTO public.profiles (id, email, role)
SELECT u.id, u.email, 'super_admin'::public.app_role
FROM auth.users AS u
WHERE lower(u.email) = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role;
