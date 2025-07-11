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

export const supabase = createClient(
  supabaseUrl || "https://wuahibwkvwtwoyyuonjk.supabase.co",
  supabaseAnonKey ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YWhpYndrdnd0d295eXVvbmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDE4MDcsImV4cCI6MjA2NzY3NzgwN30.Op_26Ogfc58vOfYZIipOfLPWHOD1zANPyWvDlVdld2Y"
);

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
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
