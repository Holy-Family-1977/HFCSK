-- Create storage bucket for TC images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tc-images', 'tc-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tc-images');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tc-images');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'tc-images');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'tc-images');
