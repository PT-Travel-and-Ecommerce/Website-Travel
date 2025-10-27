-- Initial database setup for travel booking system
-- Run this migration on your PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL DEFAULT 1,
  image_url TEXT DEFAULT '',
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create flight_packages table
CREATE TABLE IF NOT EXISTS flight_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  class TEXT NOT NULL DEFAULT 'economy',
  available_seats INTEGER NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT '0h 0m',
  baggage TEXT NOT NULL DEFAULT '20kg',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample cities
INSERT INTO cities (name, description, image_url) VALUES
  ('Jakarta', 'Ibu kota Indonesia yang modern dengan berbagai atraksi wisata', 'https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg'),
  ('Bandung', 'Kota kreatif dengan udara sejuk dan kuliner yang lezat', 'https://images.pexels.com/photos/2166927/pexels-photo-2166927.jpeg'),
  ('Yogyakarta', 'Kota budaya dengan candi bersejarah dan seni tradisional', 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg'),
  ('Bali', 'Pulau dewata dengan pantai indah dan budaya yang kaya', 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg')
ON CONFLICT DO NOTHING;

-- Insert sample packages
INSERT INTO packages (city_id, name, description, price, duration_days, image_url, features)
SELECT
  c.id,
  'Paket Basic',
  'Paket ekonomis untuk liburan hemat dengan fasilitas standar',
  1500000,
  3,
  'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
  '["Hotel Bintang 2", "Sarapan Pagi", "Tour Guide", "Transportasi Lokal"]'::jsonb
FROM cities c WHERE c.name = 'Jakarta'
ON CONFLICT DO NOTHING;

INSERT INTO packages (city_id, name, description, price, duration_days, image_url, features)
SELECT
  c.id,
  'Paket Premium',
  'Paket lengkap dengan fasilitas mewah dan pengalaman terbaik',
  3500000,
  5,
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
  '["Hotel Bintang 5", "All Meals", "Private Tour Guide", "Airport Transfer", "Free City Tour"]'::jsonb
FROM cities c WHERE c.name = 'Jakarta'
ON CONFLICT DO NOTHING;

-- Insert sample flights
INSERT INTO flight_packages (airline, flight_number, origin, destination, departure_time, arrival_time, price, class, available_seats, duration, baggage) VALUES
  ('Garuda Indonesia', 'GA-101', 'Jakarta', 'Bali', '08:00', '11:00', 1500000, 'economy', 150, '3h 0m', '20kg'),
  ('Garuda Indonesia', 'GA-102', 'Jakarta', 'Bali', '14:00', '17:00', 1800000, 'business', 30, '3h 0m', '30kg'),
  ('Lion Air', 'JT-201', 'Jakarta', 'Surabaya', '06:00', '07:30', 800000, 'economy', 180, '1h 30m', '20kg'),
  ('Citilink', 'QG-301', 'Jakarta', 'Yogyakarta', '09:00', '10:15', 900000, 'economy', 120, '1h 15m', '20kg')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_city_id ON packages(city_id);
CREATE INDEX IF NOT EXISTS idx_payments_package_id ON payments(package_id);
CREATE INDEX IF NOT EXISTS idx_flight_packages_origin ON flight_packages(origin);
CREATE INDEX IF NOT EXISTS idx_flight_packages_destination ON flight_packages(destination);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
