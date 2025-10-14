-- Add Popular Flight Routes Table
-- This allows admins to feature specific flight routes on the homepage

-- Create popular_flight_routes table
CREATE TABLE IF NOT EXISTS popular_flight_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_route_id UUID NOT NULL UNIQUE REFERENCES flight_routes(id) ON DELETE CASCADE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_popular_flight_routes_order ON popular_flight_routes(display_order);
CREATE INDEX IF NOT EXISTS idx_popular_flight_routes_active ON popular_flight_routes(is_active);
CREATE INDEX IF NOT EXISTS idx_popular_flight_routes_flight_route ON popular_flight_routes(flight_route_id);
