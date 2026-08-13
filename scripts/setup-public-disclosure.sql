-- =============================================================================
-- Public Disclosure Documents Table, Storage Bucket & RLS Setup
-- Execute this script in your Supabase SQL Editor (or via supabase db push)
-- =============================================================================

-- 1. Create table for public disclosure documents
CREATE TABLE IF NOT EXISTS public.public_disclosure_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL CHECK (section IN ('mandatory', 'documents_info')),
  sl_no integer NOT NULL,
  document_name text NOT NULL,
  file_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast section querying
CREATE INDEX IF NOT EXISTS idx_public_disclosure_docs_section_sl 
  ON public.public_disclosure_documents (section, sl_no ASC);

-- 2. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_disclosure_docs_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_public_disclosure_docs_updated_at ON public.public_disclosure_documents;
CREATE TRIGGER trg_public_disclosure_docs_updated_at
  BEFORE UPDATE ON public.public_disclosure_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_disclosure_docs_updated_at();

-- 3. Row Level Security (RLS)
ALTER TABLE public.public_disclosure_documents ENABLE ROW LEVEL SECURITY;

-- Public (anon & authenticated) can view documents
DROP POLICY IF EXISTS "public_disclosure_docs_select_all" ON public.public_disclosure_documents;
CREATE POLICY "public_disclosure_docs_select_all"
  ON public.public_disclosure_documents
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated staff admins can insert, update, or delete
DROP POLICY IF EXISTS "public_disclosure_docs_admin_all" ON public.public_disclosure_documents;
CREATE POLICY "public_disclosure_docs_admin_all"
  ON public.public_disclosure_documents
  FOR ALL
  TO authenticated
  USING (public.is_staff_admin())
  WITH CHECK (public.is_staff_admin());

-- Grants for PostgREST
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.public_disclosure_documents TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.public_disclosure_documents TO authenticated;

-- 4. Create Public Storage Bucket 'public-documents'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'public-documents',
    'public-documents',
    true,
    209715200, -- 200 MB limit
    ARRAY['application/pdf']::text[]
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: Public read access
DROP POLICY IF EXISTS "public_documents_storage_select" ON storage.objects;
CREATE POLICY "public_documents_storage_select"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'public-documents');

-- Storage RLS: Staff Admin write operations
DROP POLICY IF EXISTS "public_documents_storage_insert" ON storage.objects;
CREATE POLICY "public_documents_storage_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'public-documents'
    AND public.is_staff_admin()
  );

DROP POLICY IF EXISTS "public_documents_storage_update" ON storage.objects;
CREATE POLICY "public_documents_storage_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'public-documents'
    AND public.is_staff_admin()
  )
  WITH CHECK (
    bucket_id = 'public-documents'
    AND public.is_staff_admin()
  );

DROP POLICY IF EXISTS "public_documents_storage_delete" ON storage.objects;
CREATE POLICY "public_documents_storage_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'public-documents'
    AND public.is_staff_admin()
  );

-- 5. Seed Initial Data (Section A & Section B Documents)
-- Clear existing seed if needed, or insert non-existing records
INSERT INTO public.public_disclosure_documents (section, sl_no, document_name, file_path)
VALUES
  -- Section A: Mandatory Public Disclosure Documents
  ('mandatory', 1, 'MANDATORY PUBLIC DISCLOSURE (MAIN)', '/PMD/mpd.pdf'),
  ('mandatory', 2, 'RTE', '/PMD/RTE MP Recognition.pdf'),
  ('mandatory', 3, 'SELF CERTIFICATE', '/PMD/Self Certificate.pdf'),
  ('mandatory', 4, 'SCHOOL INFRASTRUCTURE', '/PMD/SCHOOL INFRASTRUCTURE.pdf'),

  -- Section B: Documents and Information
  ('documents_info', 1, 'Calendar', '/PMD/13 Calendar 2025-26.pdf'),
  ('documents_info', 2, 'Book List', '/PMD/06 Book List (2025-26)-8.pdf'),
  ('documents_info', 3, 'PTA', '/PMD/07 PTA (2025-26) Sign.pdf'),
  ('documents_info', 4, 'RTE MP Recognition', '/PMD/10 RTE MP Recognition New [Class NUR to VIII] (01-04-2025 to 31-03-2028)-2.pdf'),
  ('documents_info', 5, 'TC Format', '/PMD/11 TC format.pdf'),
  ('documents_info', 6, 'Staff Statement', '/PMD/14 Staff Statement (2025-26)-1.pdf'),
  ('documents_info', 7, 'Fee Structure', '/PMD/15 Fee Structure - final 2025-26 Sign.pdf'),
  ('documents_info', 8, 'Fire Certificate', '/PMD/16 Fire Certificate Sign.pdf'),
  ('documents_info', 9, 'Health & Hygiene Certificate', '/PMD/17 HEALTH AND HYGIENE CERTIFICATE Sign.pdf'),
  ('documents_info', 10, 'NOC', '/PMD/19 NOC (29-07-2024)-3.pdf'),
  ('documents_info', 11, 'Certificate of Land', '/PMD/CERTIFICATE OF LAND 2025.pdf'),
  ('documents_info', 12, 'SMC', '/PMD/SMC 2025-26 Sign.pdf'),
  ('documents_info', 13, 'Students Strength List', '/PMD/21 Students Strength List 2025-26'),
  ('documents_info', 14, 'Drinking Water', '/PMD/24 Drinking water Sign.pdf')
ON CONFLICT DO NOTHING;
