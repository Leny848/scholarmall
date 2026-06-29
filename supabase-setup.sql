-- ============================================
-- ScholarMall Pro — Supabase Database Setup
-- ============================================
-- Run this in Supabase SQL Editor (https://app.supabase.com)
-- Click "New Query" → Paste → Click "Run"

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount TEXT NOT NULL,
  deadline DATE NOT NULL,
  eligibility TEXT NOT NULL,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  scholarship_title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nationality TEXT NOT NULL,
  education_level TEXT NOT NULL,
  gpa TEXT NOT NULL,
  essay TEXT NOT NULL,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  admin_message TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies that allow ALL operations (public access for this app)
-- Scholarships: anyone can read, only authenticated can modify
CREATE POLICY "Allow public read on scholarships"
  ON scholarships FOR SELECT USING (true);

CREATE POLICY "Allow all insert on scholarships"
  ON scholarships FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on scholarships"
  ON scholarships FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on scholarships"
  ON scholarships FOR DELETE USING (true);

-- Applications
CREATE POLICY "Allow public read on applications"
  ON applications FOR SELECT USING (true);

CREATE POLICY "Allow all insert on applications"
  ON applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on applications"
  ON applications FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on applications"
  ON applications FOR DELETE USING (true);

-- Contacts
CREATE POLICY "Allow public read on contacts"
  ON contacts FOR SELECT USING (true);

CREATE POLICY "Allow all insert on contacts"
  ON contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on contacts"
  ON contacts FOR UPDATE USING (true);

CREATE POLICY "Allow all delete on contacts"
  ON contacts FOR DELETE USING (true);

-- ============================================
-- SEED DATA (Optional — run this after creating tables)
-- ============================================

INSERT INTO scholarships (title, description, amount, deadline, eligibility, category, country, image_url)
VALUES
  ('Rhodes Scholarship 2026', 'The Rhodes Scholarship is the oldest and perhaps the most prestigious international scholarship program in the world. It enables outstanding young people from around the world to study at the University of Oxford.', '$70,000', '2026-10-01', 'Open to students aged 18-24 with exceptional academic achievement, leadership, and commitment to service.', 'STEM', 'UK', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'),
  ('Fulbright Foreign Student Program', 'The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.', '$50,000', '2026-09-15', 'International students with a bachelor''s degree, strong academic record, and leadership potential.', 'Social Sciences', 'USA', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'),
  ('Chevening Scholarships', 'Chevening is the UK government''s international awards programme aimed at developing global leaders. Funded by the Foreign, Commonwealth & Development Office.', '$45,000', '2026-11-05', 'Citizens of Chevening-eligible countries with at least two years of work experience and a bachelor''s degree.', 'Business', 'UK', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'),
  ('Erasmus Mundus Joint Masters', 'Erasmus Mundus Joint Masters are prestigious international study programmes funded by the European Union. Students study in at least two different countries.', '$35,000', '2026-12-20', 'Students worldwide with a relevant bachelor''s degree. Previous Erasmus scholarship holders are not eligible.', 'Engineering', 'Germany', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800'),
  ('Vanier Canada Graduate Scholarships', 'The Vanier Canada Graduate Scholarships program aims to attract and retain world-class doctoral students by supporting those who demonstrate leadership skills and a high standard of scholarly achievement.', '$50,000', '2026-08-31', 'International and Canadian students pursuing doctoral studies at Canadian universities with a first-class average.', 'STEM', 'Canada', 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800'),
  ('Australia Awards Scholarships', 'Australia Awards Scholarships are long-term awards administered by the Department of Foreign Affairs and Trade. They provide opportunities for people from developing countries.', '$60,000', '2026-04-30', 'Citizens of participating countries in Asia, Pacific, Africa, and the Middle East with minimum work experience requirements.', 'Medicine', 'Australia', 'https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?w=800');
