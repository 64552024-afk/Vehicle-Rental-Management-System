import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  daily_price: number;
  image_url: string;
  description: string;
  available: boolean;
  category: string;
  created_at: string;
};

export type Booking = {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  car_id: string;
  pickup_location: string;
  return_location: string;
  pickup_date: string;
  return_date: string;
  total_cost: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
};

export type BookingWithCar = Booking & {
  car: Car;
};

export const LOCATIONS = [
  'Downtown Office',
  'Airport Terminal 1',
  'Airport Terminal 2',
  'Westside Mall',
  'Eastside Station',
  'Harbor Point',
];

export const CATEGORIES = ['All', 'Sedan', 'SUV', 'Sports', 'Pickup', 'Electric', 'Convertible'];
