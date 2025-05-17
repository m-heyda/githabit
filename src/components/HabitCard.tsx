import React from 'react';
import { Habit } from '@/lib/supabase';
import { colorVariants } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
}

export function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${
              habit.color === 'red' ? 'bg-red-500' :
              habit.color === 'orange' ? 'bg-orange-500' :
              habit.color === 'yellow' ? 'bg-yellow-500' :
              habit.color === 'green' ? 'bg-green-500' :
              habit.color === 'blue' ? 'bg-blue-500' :
              habit.color === 'indigo' ? 'bg-indigo-500' :
              habit.color === 'purple' ? 'bg-purple-500' :
              'bg-pink-500'
            }`}
          />
          <h3 className="font-medium text-gray-900 dark:text-white">{habit.name}</h3>
        </div>
        <div className="flex space-x-1">
          {onEdit && (
            <button 
              onClick={() => onEdit(habit)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(habit)}
              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Type: {habit.type === 'boolean' ? 'Yes/No' : 'Numeric'}
      </div>
      {habit.type === 'unit' && habit.target_value && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Target: {habit.target_value} units
        </div>
      )}
    </div>
  );
}
