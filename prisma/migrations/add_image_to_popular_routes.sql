-- Add imageUrl column to popular_flight_routes table
ALTER TABLE popular_flight_routes ADD COLUMN IF NOT EXISTS image_url TEXT;
