import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useHabitStore } from '../useHabitStore';

describe('useHabitStore Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should persist data to localStorage', async () => {
    const { addHabit } = useHabitStore.getState();
    addHabit('Persist Me', '#123456');

    const storage = JSON.parse(localStorage.getItem('routine-checker-storage') || '{}');
    expect(storage.state.habits).toHaveLength(1);
    expect(storage.state.habits[0].name).toBe('Persist Me');
  });

  it('should hydrate data from localStorage', async () => {
    const mockData = {
      state: {
        habits: [{ id: '1', name: 'Saved Habit', color: '#654321', createdAt: Date.now() }],
        records: [{ date: '2026-01-13', completedHabitIds: ['1'] }],
      },
      version: 0,
    };
    localStorage.setItem('routine-checker-storage', JSON.stringify(mockData));

    await useHabitStore.persist.rehydrate();

    const { habits, records } = useHabitStore.getState();
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Saved Habit');
    expect(records).toHaveLength(1);
    expect(records[0].completedHabitIds).toContain('1');
  });

  it('should track hydration status', async () => {
    useHabitStore.setState({ _hasHydrated: false });
    expect(useHabitStore.getState()._hasHydrated).toBe(false);
    
    await useHabitStore.persist.rehydrate();
    
    expect(useHabitStore.getState()._hasHydrated).toBe(true);
  });
});
