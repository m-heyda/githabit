'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HabitForm } from '@/components/HabitForm';
import { HabitList } from '@/components/HabitList';
import { Habit } from '@/lib/supabase';
import { createHabit, getHabits, deleteHabit } from '@/lib/habit-service';
import { CreateHabitData } from '@/lib/habit-service';

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If we're not loading and there's no user, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Fetch habits when the component mounts
  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const habitsData = await getHabits();
      setHabits(habitsData);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError('Failed to load habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (habitData: CreateHabitData) => {
    try {
      const newHabit = await createHabit(habitData);
      setHabits(prevHabits => [newHabit, ...prevHabits]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding habit:', err);
      throw err; // Re-throw to be handled by the form
    }
  };

  const handleDeleteHabit = async (habit: Habit) => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      try {
        await deleteHabit(habit.id);
        setHabits(prevHabits => prevHabits.filter(h => h.id !== habit.id));
      } catch (err) {
        console.error('Error deleting habit:', err);
        setError('Failed to delete habit. Please try again.');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  // If no user, show nothing while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Habit Tracker</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="sr-only">Close</span>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Habits</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {showForm ? 'Cancel' : 'Add New Habit'}
            </button>
          </div>

          {showForm && (
            <div className="mb-6">
              <HabitForm
                onSubmit={handleAddHabit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Loading habits...</p>
            </div>
          ) : (
            <HabitList
              habits={habits}
              onDeleteHabit={handleDeleteHabit}
            />
          )}
        </div>
      </main>
    </div>
  );
}
