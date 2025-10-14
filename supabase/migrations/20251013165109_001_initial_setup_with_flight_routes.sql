/*
  # Initial Database Setup - Travel Booking System with Flight Routes

  1. New Tables
    - `cities`: City/destination master data
    - `flight_routes`: Main flight route packages with fare breakdown
    - `payments`: Payment transactions
    - `users`: Customer accounts
    - `admins`: Admin accounts
    - `customer_reviews`: Customer reviews
    - `site_settings`: Site configuration
    - `bank_accounts`: Payment bank accounts
      
  2. Security
    - Enable RLS on all tables
    - Public read access for cities, flight_routes, reviews, bank_accounts
    - Authenticated access for users and admins tables
    - Admin-only write access for all master data tables
    
  3. Important Notes
    - Removed packages, flight_packages, hero_banners, popular_destinations tables
    - Flight routes now contain complete fare breakdown
    - Popular destinations will be shown from flight_routes data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create flight_routes table with fare breakdown
CREATE TABLE IF NOT EXISTS flight_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  departure_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  arrival_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  return_date DATE,
  airline TEXT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration TEXT NOT NULL,
  rating INT DEFAULT 0,
  available_seats INT DEFAULT 0,
  flight_class TEXT DEFAULT 'economy',
  baggage_info TEXT DEFAULT '20kg',
  image_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  base_fare DECIMAL(15, 2) DEFAULT 0,
  tax DECIMAL(15, 2) DEFAULT 0,
  service_fee DECIMAL(15, 2) DEFAULT 0,
  baggage_fee DECIMAL(15, 2) DEFAULT 0,
  wifi_fee DECIMAL(15, 2) DEFAULT 0,
  meal_fee DECIMAL(15, 2) DEFAULT 0,
  insurance_fee DECIMAL(15, 2) DEFAULT 0,
  other_fees JSONB DEFAULT '[]'::jsonb,
  discount DECIMAL(15, 2) DEFAULT 0,
  total_price DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_route_id UUID NOT NULL REFERENCES flight_routes(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_reviews table
CREATE TABLE IF NOT EXISTS customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  rating INT DEFAULT 5,
  comment TEXT NOT NULL,
  image_url TEXT,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT DEFAULT '/logo.png',
  site_name TEXT DEFAULT 'Travel Indonesia',
  meta_title TEXT DEFAULT 'Travel Indonesia - Jelajahi Dunia Bersama Kami',
  meta_description TEXT DEFAULT 'Temukan penawaran terbaik untuk penerbangan, hotel, dan paket liburan',
  hero_title TEXT DEFAULT 'JELAJAHI DUNIA BERSAMA KAMI',
  hero_subtitle TEXT DEFAULT 'Temukan penawaran terbaik untuk penerbangan, hotel, dan paket liburan',
  hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
  flight_hero_title TEXT DEFAULT 'Make your travel wishlist, we''ll do the rest',
  flight_hero_subtitle TEXT DEFAULT 'Special offers to suit your plan',
  flight_hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1542296332-2e4473faf563',
  whatsapp_number TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bank_accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cities
CREATE POLICY "Anyone can view cities"
  ON cities FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert cities"
  ON cities FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update cities"
  ON cities FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete cities"
  ON cities FOR DELETE
  USING (false);

-- RLS Policies for flight_routes
CREATE POLICY "Anyone can view flight routes"
  ON flight_routes FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert flight routes"
  ON flight_routes FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update flight routes"
  ON flight_routes FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete flight routes"
  ON flight_routes FOR DELETE
  USING (false);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (false);

CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can update payments"
  ON payments FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete payments"
  ON payments FOR DELETE
  USING (false);

-- RLS Policies for customer_reviews
CREATE POLICY "Anyone can view active reviews"
  ON customer_reviews FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can insert reviews"
  ON customer_reviews FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update reviews"
  ON customer_reviews FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete reviews"
  ON customer_reviews FOR DELETE
  USING (false);

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  USING (false);

-- RLS Policies for bank_accounts
CREATE POLICY "Anyone can view active bank accounts"
  ON bank_accounts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can insert bank accounts"
  ON bank_accounts FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update bank accounts"
  ON bank_accounts FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete bank accounts"
  ON bank_accounts FOR DELETE
  USING (false);

-- RLS Policies for users
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (false);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (false);

-- RLS Policies for admins
CREATE POLICY "No public access to admins"
  ON admins FOR SELECT
  USING (false);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_flight_routes_departure_city ON flight_routes(departure_city_id);
CREATE INDEX IF NOT EXISTS idx_flight_routes_arrival_city ON flight_routes(arrival_city_id);
CREATE INDEX IF NOT EXISTS idx_flight_routes_departure_date ON flight_routes(departure_date);
CREATE INDEX IF NOT EXISTS idx_flight_routes_total_price ON flight_routes(total_price);
CREATE INDEX IF NOT EXISTS idx_payments_flight_route ON payments(flight_route_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_email ON payments(user_email);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Insert sample cities
INSERT INTO cities (name, description, image_url) VALUES
  ('Jakarta', 'Ibu kota Indonesia yang modern dengan berbagai atraksi wisata', 'https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg'),
  ('Bali', 'Pulau dewata dengan pantai indah dan budaya yang kaya', 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg'),
  ('Surabaya', 'Kota pahlawan dengan sejarah yang kaya', 'https://images.pexels.com/photos/2166927/pexels-photo-2166927.jpeg'),
  ('Yogyakarta', 'Kota budaya dengan candi bersejarah dan seni tradisional', 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg'),
  ('Bandung', 'Kota kreatif dengan udara sejuk dan kuliner yang lezat', 'https://images.pexels.com/photos/2166927/pexels-photo-2166927.jpeg'),
  ('Medan', 'Kota metropolitan terbesar di Sumatera', 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg')
ON CONFLICT DO NOTHING;

-- Insert sample flight routes
INSERT INTO flight_routes (
  departure_city_id, arrival_city_id, departure_date, return_date,
  airline, departure_time, arrival_time, duration,
  rating, available_seats, flight_class, baggage_info,
  image_url, description,
  base_fare, tax, service_fee, wifi_fee, meal_fee, baggage_fee, discount, total_price
)
SELECT
  (SELECT id FROM cities WHERE name = 'Jakarta'),
  (SELECT id FROM cities WHERE name = 'Bali'),
  '2025-11-01'::DATE,
  '2025-11-05'::DATE,
  'Garuda Indonesia',
  '08:00'::TIME,
  '11:00'::TIME,
  '3h 0m',
  5,
  150,
  'economy',
  '20kg checked baggage',
  'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg',
  'Penerbangan nyaman dari Jakarta ke Bali dengan fasilitas lengkap',
  1200000,
  180000,
  50000,
  0,
  0,
  0,
  50000,
  1380000
WHERE NOT EXISTS (SELECT 1 FROM flight_routes);

INSERT INTO flight_routes (
  departure_city_id, arrival_city_id, departure_date, return_date,
  airline, departure_time, arrival_time, duration,
  rating, available_seats, flight_class, baggage_info,
  image_url, description,
  base_fare, tax, service_fee, wifi_fee, meal_fee, baggage_fee, discount, total_price
)
SELECT
  (SELECT id FROM cities WHERE name = 'Jakarta'),
  (SELECT id FROM cities WHERE name = 'Yogyakarta'),
  '2025-11-15'::DATE,
  NULL,
  'Lion Air',
  '09:00'::TIME,
  '10:15'::TIME,
  '1h 15m',
  4,
  120,
  'economy',
  '20kg checked baggage',
  'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg',
  'Penerbangan cepat dan terjangkau ke kota budaya Yogyakarta',
  700000,
  105000,
  30000,
  0,
  0,
  0,
  0,
  835000
WHERE NOT EXISTS (SELECT 1 FROM flight_routes LIMIT 1 OFFSET 1);

-- Insert initial site settings
INSERT INTO site_settings (id) 
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Insert sample bank accounts
INSERT INTO bank_accounts (bank_name, account_number, account_name, display_order) VALUES
  ('BCA', '1234567890', 'PT Travel Indonesia', 1),
  ('Mandiri', '0987654321', 'PT Travel Indonesia', 2),
  ('BNI', '1122334455', 'PT Travel Indonesia', 3)
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO customer_reviews (customer_name, rating, comment, location, image_url) VALUES
  ('Budi Santoso', 5, 'Pelayanan sangat memuaskan! Perjalanan kami ke Bali sangat menyenangkan.', 'Jakarta', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'),
  ('Siti Rahma', 5, 'Harga terjangkau dan proses booking mudah. Recommended!', 'Surabaya', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'),
  ('Ahmad Wijaya', 4, 'Pengalaman yang baik, akan menggunakan lagi untuk perjalanan berikutnya.', 'Bandung', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg')
ON CONFLICT DO NOTHING;