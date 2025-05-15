import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type HabitType = 'boolean' | 'unit';

export type HabitColor = 
  | 'red' 
  | 'orange' 
  | 'yellow' 
  | 'green' 
  | 'blue' 
  | 'indigo' 
  | 'purple' 
  | 'pink';

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  type: HabitType;
  target_value: number | null;
  color: HabitColor;
  created_at: string;
  updated_at: string;
};

export type HabitEntry = {
  id: string;
  habit_id: string;
  date: string;
  status: boolean | null;
  value: number | null;
  percentage: number | null;
  created_at: string;
};
