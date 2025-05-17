import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { colorOptions } from '@/lib/utils';
import { CreateHabitData } from '@/lib/habit-service';
import { HabitType } from '@/lib/supabase';

interface HabitFormProps {
  onSubmit: (data: CreateHabitData) => Promise<void>;
  onCancel?: () => void;
}

export function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<HabitType>('boolean');
  const [targetValue, setTargetValue] = useState<string>('');
  const [color, setColor] = useState('blue');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('Habit name is required');
      return;
    }

    setLoading(true);
    
    try {
      const habitData: CreateHabitData = {
        name: name.trim(),
        type,
        target_value: type === 'unit' && targetValue ? parseFloat(targetValue) : null,
        color: color as any,
      };
      
      await onSubmit(habitData);
      
      // Reset form
      setName('');
      setType('boolean');
      setTargetValue('');
      setColor('blue');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while creating the habit');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Habit</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <Input
        label="Habit Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Drink water, Exercise, Read"
        required
      />
      
      <Select
        label="Habit Type"
        value={type}
        onChange={(e) => setType(e.target.value as HabitType)}
        options={[
          { value: 'boolean', label: 'Yes/No (Did you do it?)' },
          { value: 'unit', label: 'Numeric (How many units?)' },
        ]}
      />
      
      {type === 'unit' && (
        <Input
          label="Target Value (optional)"
          type="number"
          min="0"
          step="0.01"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          placeholder="e.g., 8 glasses, 10000 steps"
        />
      )}
      
      <Select
        label="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        options={colorOptions}
      />
      
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Habit'}
        </button>
      </div>
    </form>
  );
}
