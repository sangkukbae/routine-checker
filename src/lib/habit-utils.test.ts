import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateMonthlyStats, calculateCurrentStreak } from './habit-utils';
import type { Habit, DailyRecord } from '../types/habit';

describe('habit-utils', () => {
  const mockHabits: Habit[] = [
    { id: '1', name: 'Habit 1', color: '#ff0000', createdAt: Date.now() },
    { id: '2', name: 'Habit 2', color: '#00ff00', createdAt: Date.now() },
  ];

  describe('calculateMonthlyStats', () => {
    it('returns zero stats when no habits exist', () => {
      const result = calculateMonthlyStats([], [], new Date());
      expect(result.totalCompletionRate).toBe(0);
      expect(result.habitStats).toEqual({});
    });

    it('calculates correct completion rate for a month', () => {
      const date = new Date(2024, 0, 1);
      const records: DailyRecord[] = [
        { date: '2024-01-01', completedHabitIds: ['1', '2'] },
        { date: '2024-01-02', completedHabitIds: ['1'] },
      ];
      
      const result = calculateMonthlyStats(mockHabits, records, date);
      
      expect(result.totalCompletionRate).toBe(5);
      expect(result.habitStats['1']).toBe(2);
      expect(result.habitStats['2']).toBe(1);
    });
  });

  describe('calculateCurrentStreak', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-10'));
    });

    it('returns 0 for empty records', () => {
      expect(calculateCurrentStreak('1', [])).toBe(0);
    });

    it('calculates streak including today', () => {
      const records: DailyRecord[] = [
        { date: '2024-01-10', completedHabitIds: ['1'] },
        { date: '2024-01-09', completedHabitIds: ['1'] },
        { date: '2024-01-08', completedHabitIds: ['1'] },
      ];
      expect(calculateCurrentStreak('1', records)).toBe(3);
    });

    it('calculates streak excluding today but including yesterday', () => {
      const records: DailyRecord[] = [
        { date: '2024-01-09', completedHabitIds: ['1'] },
        { date: '2024-01-08', completedHabitIds: ['1'] },
      ];
      expect(calculateCurrentStreak('1', records)).toBe(2);
    });

    it('returns 0 if streak is broken yesterday', () => {
      const records: DailyRecord[] = [
        { date: '2024-01-10', completedHabitIds: ['1'] },
        { date: '2024-01-08', completedHabitIds: ['1'] },
      ];
      expect(calculateCurrentStreak('1', records)).toBe(1);
    });

    it('handles multi-month streaks', () => {
      const records: DailyRecord[] = [
        { date: '2024-01-10', completedHabitIds: ['1'] },
        { date: '2024-01-09', completedHabitIds: ['1'] },
        { date: '2023-12-31', completedHabitIds: ['1'] },
        { date: '2023-12-30', completedHabitIds: ['1'] },
      ];
      
      expect(calculateCurrentStreak('1', records)).toBe(2);

      const fullRecords = [
        ...records,
        { date: '2024-01-08', completedHabitIds: ['1'] },
        { date: '2024-01-07', completedHabitIds: ['1'] },
        { date: '2024-01-06', completedHabitIds: ['1'] },
        { date: '2024-01-05', completedHabitIds: ['1'] },
        { date: '2024-01-04', completedHabitIds: ['1'] },
        { date: '2024-01-03', completedHabitIds: ['1'] },
        { date: '2024-01-02', completedHabitIds: ['1'] },
        { date: '2024-01-01', completedHabitIds: ['1'] },
      ];
      expect(calculateCurrentStreak('1', fullRecords)).toBe(12);
    });
  });
});
