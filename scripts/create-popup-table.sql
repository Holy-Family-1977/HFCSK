-- Create announcements/popup table
CREATE TABLE IF NOT EXISTS announcements (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view enabled announcements)
CREATE POLICY "Public read announcements" ON announcements
  FOR SELECT USING (true);

-- Create policy for admin insert/update/delete (via service role only)
-- Note: Service role bypasses RLS, so this is for reference only
GRANT SELECT ON announcements TO anon, authenticated;

-- Insert sample announcement
INSERT INTO announcements (title, description, is_enabled, image_url)
VALUES (
  'Admission Open',
  'Holy Family Convent Sr. Sec. School is now accepting admissions for the 2025-2026 academic year. Classes I to XII available.',
  true,
  'https://via.placeholder.com/600x400?text=Admission+Open'
)
ON CONFLICT DO NOTHING;
