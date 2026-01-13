import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addMonths } from 'date-fns';
import type { Habit, DailyRecord } from '../types/habit';

interface HabitState {
  habits: Habit[];
  records: DailyRecord[];
  currentDate: Date;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addHabit: (name: string, color: string) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (date: string, habitId: string) => void;
  setMonth: (offset: number) => void;
  reorderHabits: (activeId: string, overId: string) => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      records: [],
      currentDate: new Date(),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      addHabit: (name, color) =>
        set((state) => {
          if (state.habits.length >= 10) return state;
          return {
            habits: [
              ...state.habits,
              {
                id: crypto.randomUUID(),
                name,
                color,
                createdAt: Date.now(),
              },
            ],
          };
        }),
      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          ),
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
          records: state.records.map((record) => ({
            ...record,
            completedHabitIds: record.completedHabitIds.filter((habitId) => habitId !== id),
          })),
        })),
      toggleHabit: (date, habitId) =>
        set((state) => {
          const recordIndex = state.records.findIndex((r) => r.date === date);

          if (recordIndex === -1) {
            return {
              records: [
                ...state.records,
                { date, completedHabitIds: [habitId] },
              ],
            };
          }

          const record = state.records[recordIndex];
          const isCompleted = record.completedHabitIds.includes(habitId);

          const updatedCompletedHabitIds = isCompleted
            ? record.completedHabitIds.filter((id) => id !== habitId)
            : [...record.completedHabitIds, habitId];

          const updatedRecords = [...state.records];
          updatedRecords[recordIndex] = {
            ...record,
            completedHabitIds: updatedCompletedHabitIds,
          };

          return { records: updatedRecords };
        }),
      setMonth: (offset) =>
        set((state) => ({
          currentDate: addMonths(state.currentDate, offset),
        })),
      reorderHabits: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.habits.findIndex((h) => h.id === activeId);
          const newIndex = state.habits.findIndex((h) => h.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const newHabits = [...state.habits];
          const [movedHabit] = newHabits.splice(oldIndex, 1);
          newHabits.splice(newIndex, 0, movedHabit);

          return { habits: newHabits };
        }),
    }),
    {
      name: 'routine-checker-storage',
      partialize: (state) => ({
        habits: state.habits,
        records: state.records,
      }),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
