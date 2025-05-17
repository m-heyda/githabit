import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type SupabaseClient } from '@supabase/supabase-js';

// Create a Supabase client for use in client components
export const createClient = () => {
  return createClientComponentClient();
};

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
