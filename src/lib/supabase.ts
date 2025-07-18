import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase credentials not found. Please create a .env file with:"
  );
  console.warn("REACT_APP_SUPABASE_URL=your_supabase_project_url");
  console.warn("REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key");
  console.warn("See SUPABASE_SETUP.md for detailed instructions.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Database types
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine_type: string;
  transmission: string;
  fuel_type: string;
  condition: "new" | "used";
  description: string;
  images: string[];
  created_at: string;
  updated_at: string;
  car_type_id?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
