/*
# Car Rental System Schema

1. New Tables
- `cars`: Stores vehicle inventory (brand, model, year, seats, transmission, fuel type, daily price, image, availability).
- `bookings`: Stores rental bookings (customer info, dates, locations, total cost, status).

2. Security
- RLS enabled on both tables with anon+authenticated full CRUD (single-tenant demo app, no auth).
- All data is intentionally public for demonstration purposes.

3. Seed Data
- 8 sample cars across different categories (sedan, SUV, sports, pickup, electric, convertible).
- 3 sample bookings (one active, one completed, one cancelled) for demo purposes.
*/

CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year int NOT NULL,
  seats int NOT NULL,
  transmission text NOT NULL DEFAULT 'Automatic',
  fuel_type text NOT NULL DEFAULT 'Petrol',
  daily_price numeric(10,2) NOT NULL,
  image_url text NOT NULL,
  description text DEFAULT '',
  available boolean NOT NULL DEFAULT true,
  category text NOT NULL DEFAULT 'Sedan',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  pickup_location text NOT NULL,
  return_location text NOT NULL,
  pickup_date date NOT NULL,
  return_date date NOT NULL,
  total_cost numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_cars" ON cars;
CREATE POLICY "anon_select_cars" ON cars FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_cars" ON cars;
CREATE POLICY "anon_insert_cars" ON cars FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_cars" ON cars;
CREATE POLICY "anon_update_cars" ON cars FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_cars" ON cars;
CREATE POLICY "anon_delete_cars" ON cars FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE
  TO anon, authenticated USING (true);

-- Seed cars
INSERT INTO cars (brand, model, year, seats, transmission, fuel_type, daily_price, image_url, description, available, category) VALUES
('BMW', '5 Series', 2023, 5, 'Automatic', 'Petrol', 85.00, 'https://images.pexels.com/photos/37094847/pexels-photo-37094847.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'A sleek black sedan combining luxury and performance. Perfect for business trips and city driving.', true, 'Sedan'),
('Audi', 'A4', 2022, 5, 'Automatic', 'Petrol', 75.00, 'https://images.pexels.com/photos/14764071/pexels-photo-14764071.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Refined German engineering with a comfortable interior and smooth ride quality.', true, 'Sedan'),
('Toyota', 'RAV4', 2023, 5, 'Automatic', 'Hybrid', 65.00, 'https://images.pexels.com/photos/17612417/pexels-photo-17612417.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'A versatile hybrid SUV ideal for family adventures and outdoor trips.', true, 'SUV'),
('Mercedes', 'GLE', 2023, 7, 'Automatic', 'Diesel', 95.00, 'https://images.pexels.com/photos/27497571/pexels-photo-27497571.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'A premium luxury SUV with spacious seating for seven and cutting-edge technology.', true, 'SUV'),
('Ferrari', '488 GTB', 2022, 2, 'Automatic', 'Petrol', 350.00, 'https://images.pexels.com/photos/11931440/pexels-photo-11931440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'An iconic Italian sports car delivering breathtaking performance and head-turning style.', true, 'Sports'),
('Ford', 'F-150', 2023, 5, 'Automatic', 'Petrol', 70.00, 'https://images.pexels.com/photos/7873720/pexels-photo-7873720.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'A rugged and reliable pickup truck built for work and adventure.', true, 'Pickup'),
('Tesla', 'Model 3', 2023, 5, 'Automatic', 'Electric', 90.00, 'https://images.pexels.com/photos/20000977/pexels-photo-20000977.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'A cutting-edge electric sedan with impressive range, instant acceleration, and minimalist design.', true, 'Electric'),
('Mercedes', 'SL Roadster', 2022, 2, 'Automatic', 'Petrol', 180.00, 'https://images.pexels.com/photos/16716063/pexels-photo-16716063.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'A stunning convertible roadster offering open-air luxury and thrilling performance.', true, 'Convertible')
ON CONFLICT DO NOTHING;

-- Seed bookings
INSERT INTO bookings (customer_name, email, phone, car_id, pickup_location, return_location, pickup_date, return_date, total_cost, status)
SELECT 'John Smith', 'john.smith@email.com', '555-0101', c.id, 'Downtown Office', 'Airport Terminal 2', '2026-10-05', '2026-10-10', 425.00, 'active'
FROM cars c WHERE c.brand = 'BMW' AND c.model = '5 Series'
ON CONFLICT DO NOTHING;

INSERT INTO bookings (customer_name, email, phone, car_id, pickup_location, return_location, pickup_date, return_date, total_cost, status)
SELECT 'Sarah Johnson', 'sarah.j@email.com', '555-0102', c.id, 'Airport Terminal 1', 'Downtown Office', '2026-09-15', '2026-09-18', 195.00, 'completed'
FROM cars c WHERE c.brand = 'Toyota' AND c.model = 'RAV4'
ON CONFLICT DO NOTHING;

INSERT INTO bookings (customer_name, email, phone, car_id, pickup_location, return_location, pickup_date, return_date, total_cost, status)
SELECT 'Mike Davis', 'mike.davis@email.com', '555-0103', c.id, 'Westside Mall', 'Eastside Station', '2026-10-12', '2026-10-14', 150.00, 'active'
FROM cars c WHERE c.brand = 'Tesla' AND c.model = 'Model 3'
ON CONFLICT DO NOTHING;
