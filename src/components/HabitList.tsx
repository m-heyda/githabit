import React from 'react';
import { Habit } from '@/lib/supabase';
import { HabitCard } from './HabitCard';

interface HabitListProps {
  habits: Habit[];
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habit: Habit) => void;
}

export function HabitList({ habits, onEditHabit, onDeleteHabit }: HabitListProps) {
  // Group habits by type
  const booleanHabits = habits.filter(habit => habit.type === 'boolean');
  const unitHabits = habits.filter(habit => habit.type === 'unit');

  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          You don't have any habits yet. Add your first habit to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {booleanHabits.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-3">Yes/No Habits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {booleanHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={onEditHabit}
                onDelete={onDeleteHabit}
              />
            ))}
          </div>
        </div>
      )}

      {unitHabits.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-3">Numeric Habits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={onEditHabit}
                onDelete={onDeleteHabit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
