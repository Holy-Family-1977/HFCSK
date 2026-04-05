-- =============================================================================
-- School TC + Announcements — schema, RLS, storage (Supabase PostgreSQL)
-- Apply via: supabase db push   OR   SQL Editor as postgres role
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin');
  END IF;
END$$;

-- -----------------------------------------------------------------------------
-- profiles (only super_admin + admin — public users are not stored here)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- At most one super_admin row (enforces single super_admin)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_one_super_admin_only
  ON public.profiles (role)
  WHERE role = 'super_admin';

CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (lower(email));

COMMENT ON TABLE public.profiles IS 'Authenticated staff only. public_user is unauthenticated and has no row here.';

-- -----------------------------------------------------------------------------
-- transfer_certificates
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transfer_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  admission_number text NOT NULL,
  file_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT transfer_certificates_admission_number_len CHECK (length(admission_number) BETWEEN 1 AND 128),
  CONSTRAINT transfer_certificates_student_name_nonempty CHECK (length(trim(student_name)) > 0),
  CONSTRAINT transfer_certificates_admission_number_unique UNIQUE (admission_number)
);

CREATE OR REPLACE FUNCTION public.transfer_certificates_normalize()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.admission_number := lower(trim(NEW.admission_number));
  NEW.student_name := trim(NEW.student_name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_transfer_certificates_normalize ON public.transfer_certificates;
CREATE TRIGGER trg_transfer_certificates_normalize
  BEFORE INSERT OR UPDATE OF admission_number, student_name
  ON public.transfer_certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.transfer_certificates_normalize();

CREATE INDEX IF NOT EXISTS transfer_certificates_created_at_idx
  ON public.transfer_certificates (created_at DESC);

COMMENT ON COLUMN public.transfer_certificates.file_path IS 'Object path inside bucket tc-files (never expose to public clients; use signed URLs).';

-- -----------------------------------------------------------------------------
-- announcements
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_path text,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT announcements_title_nonempty CHECK (length(trim(title)) > 0)
);

CREATE INDEX IF NOT EXISTS announcements_enabled_created_idx
  ON public.announcements (created_at DESC)
  WHERE is_enabled = true;

-- -----------------------------------------------------------------------------
-- Helper: is current user an admin (including super_admin)?
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'super_admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "profiles_select_own_or_super" ON public.profiles;
CREATE POLICY "profiles_select_own_or_super"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "profiles_super_admin_insert" ON public.profiles;
CREATE POLICY "profiles_super_admin_insert"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "profiles_super_admin_update" ON public.profiles;
CREATE POLICY "profiles_super_admin_update"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "profiles_super_admin_delete" ON public.profiles;
CREATE POLICY "profiles_super_admin_delete"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- transfer_certificates: staff admins only (public TC access via Edge Function + signed URLs)
DROP POLICY IF EXISTS "tc_staff_admin_all" ON public.transfer_certificates;
CREATE POLICY "tc_staff_admin_all"
  ON public.transfer_certificates
  FOR ALL
  TO authenticated
  USING (public.is_staff_admin())
  WITH CHECK (public.is_staff_admin());

-- announcements: staff full CRUD; anon can read enabled rows only
DROP POLICY IF EXISTS "announcements_staff_admin_all" ON public.announcements;
CREATE POLICY "announcements_staff_admin_all"
  ON public.announcements
  FOR ALL
  TO authenticated
  USING (public.is_staff_admin())
  WITH CHECK (public.is_staff_admin());

DROP POLICY IF EXISTS "announcements_anon_read_enabled" ON public.announcements;
CREATE POLICY "announcements_anon_read_enabled"
  ON public.announcements
  FOR SELECT
  TO anon
  USING (is_enabled = true);

DROP POLICY IF EXISTS "announcements_authenticated_public_read_enabled" ON public.announcements;
CREATE POLICY "announcements_authenticated_public_read_enabled"
  ON public.announcements
  FOR SELECT
  TO authenticated
  USING (
    is_enabled = true
    AND NOT public.is_staff_admin()
  );

-- -----------------------------------------------------------------------------
-- Grants (explicit read for PostgREST)
-- -----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transfer_certificates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT SELECT ON public.announcements TO anon;

-- -----------------------------------------------------------------------------
-- Storage buckets
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'tc-files',
    'tc-files',
    false,
    5242880,
    ARRAY['application/pdf']::text[]
  ),
  (
    'announcement-images',
    'announcement-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- -----------------------------------------------------------------------------
-- Storage RLS policies
-- -----------------------------------------------------------------------------
-- tc-files: only staff admins (no public read — use signed URLs from Edge Functions)
DROP POLICY IF EXISTS "tc_files_admins_insert" ON storage.objects;
CREATE POLICY "tc_files_admins_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'tc-files'
    AND public.is_staff_admin()
  );

DROP POLICY IF EXISTS "tc_files_admins_select" ON storage.objects;
CREATE POLICY "tc_files_admins_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'tc-files'
    AND public.is_staff_admin()
  );

DROP POLICY IF EXISTS "tc_files_admins_update" ON storage.objects;
CREATE POLICY "tc_files_admins_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'tc-files'
    AND public.is_staff_admin()
  )
  WITH CHECK (
    bucket_id = 'tc-files'
    AND public.is_staff_admin()
  );

DROP POLICY IF EXISTS "tc_files_admins_delete" ON storage.objects;
CREATE POLICY "tc_files_admins_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'tc-files'
    AND public.is_staff_admin()
  );

-- announcement-images: public read; writes only for staff admins
DROP POLICY IF EXISTS "announcement_images_public_read" ON storage.objects;
CREATE POLICY "announcement_images_public_read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'announcement-images');

DROP POLICY IF EXISTS "announcement_images_admins_insert" ON storage.objects;
CREATE POLICY "announcement_images_admins_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'announcement-images'
    AND public.is_staff_admin()
  );

DROP POLICY IF EXISTS "announcement_images_admins_update" ON storage.objects;
CREATE POLICY "announcement_images_admins_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'announcement-images'
    AND public.is_staff_admin()
  )
  WITH CHECK (
    bucket_id = 'announcement-images'
    AND public.is_staff_admin()
  );

DROP POLICY IF EXISTS "announcement_images_admins_delete" ON storage.objects;
CREATE POLICY "announcement_images_admins_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'announcement-images'
    AND public.is_staff_admin()
  );
