import { createClient } from '@/lib/supabase';
import { Habit, HabitEntry, HabitType, HabitColor } from '@/lib/supabase';

export interface CreateHabitData {
  name: string;
  type: HabitType;
  target_value: number | null;
  color: HabitColor;
}

export interface UpdateHabitData {
  name?: string;
  target_value?: number | null;
  color?: HabitColor;
}

export interface CreateHabitEntryData {
  habit_id: string;
  date: string;
  status?: boolean | null;
  value?: number | null;
  percentage?: number | null;
}

export interface UpdateHabitEntryData {
  status?: boolean | null;
  value?: number | null;
  percentage?: number | null;
}

export async function getHabits(): Promise<Habit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }

  return data as Habit[];
}

export async function getHabitsByType(type: HabitType): Promise<Habit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${type} habits:`, error);
    throw error;
  }

  return data as Habit[];
}

export async function getHabit(id: string): Promise<Habit | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // PGRST116 means no rows returned
      return null;
    }
    console.error('Error fetching habit:', error);
    throw error;
  }

  return data as Habit;
}

export async function createHabit(habitData: CreateHabitData): Promise<Habit> {
  const supabase = createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be authenticated to create a habit');
  }

  // Add the user_id to the habit data
  const { data, error } = await supabase
    .from('habits')
    .insert({
      ...habitData,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating habit:', error);
    throw error;
  }

  return data as Habit;
}

export async function updateHabit(id: string, habitData: UpdateHabitData): Promise<Habit> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('habits')
    .update(habitData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating habit:', error);
    throw error;
  }

  return data as Habit;
}

export async function deleteHabit(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
}

export async function getHabitEntries(habitId: string, startDate?: string, endDate?: string): Promise<HabitEntry[]> {
  const supabase = createClient();
  let query = supabase
    .from('habit_entries')
    .select('*')
    .eq('habit_id', habitId);

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    console.error('Error fetching habit entries:', error);
    throw error;
  }

  return data as HabitEntry[];
}

export async function getHabitEntry(habitId: string, date: string): Promise<HabitEntry | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('habit_entries')
    .select('*')
    .eq('habit_id', habitId)
    .eq('date', date)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // PGRST116 means no rows returned
      return null;
    }
    console.error('Error fetching habit entry:', error);
    throw error;
  }

  return data as HabitEntry;
}

export async function createHabitEntry(entryData: CreateHabitEntryData): Promise<HabitEntry> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('habit_entries')
    .insert(entryData)
    .select()
    .single();

  if (error) {
    console.error('Error creating habit entry:', error);
    throw error;
  }

  return data as HabitEntry;
}

export async function updateHabitEntry(id: string, entryData: UpdateHabitEntryData): Promise<HabitEntry> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('habit_entries')
    .update(entryData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating habit entry:', error);
    throw error;
  }

  return data as HabitEntry;
}

export async function deleteHabitEntry(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('habit_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting habit entry:', error);
    throw error;
  }
}
