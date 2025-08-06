-- Insert sample TC records (optional)
INSERT INTO tc_records (name, admission_number, tc_image_url) VALUES
('John Doe', 'HF2023001', 'sample-tc-1.jpg'),
('Jane Smith', 'HF2023002', 'sample-tc-2.jpg'),
('Michael Johnson', 'HF2023003', 'sample-tc-3.jpg')
ON CONFLICT (admission_number) DO NOTHING;
