-- Create the tc_records table
CREATE TABLE IF NOT EXISTS tc_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  admission_number VARCHAR(100) NOT NULL UNIQUE,
  tc_image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on admission_number for faster searches
CREATE INDEX IF NOT EXISTS idx_tc_records_admission_number ON tc_records(admission_number);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tc_records_updated_at 
    BEFORE UPDATE ON tc_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
