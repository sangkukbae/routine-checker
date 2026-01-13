import { describe, it, expect, beforeEach } from 'vitest';
import { useHabitStore } from '../useHabitStore';

describe('useHabitStore', () => {
  beforeEach(() => {
    useHabitStore.setState({ habits: [], records: [] });
  });

  it('should add a habit correctly', () => {
    const { addHabit } = useHabitStore.getState();
    addHabit('Test Habit', '#ff0000');
    
    const { habits } = useHabitStore.getState();
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Test Habit');
    expect(habits[0].color).toBe('#ff0000');
  });

  it('should not add more than 10 habits', () => {
    const { addHabit } = useHabitStore.getState();
    
    for (let i = 0; i < 10; i++) {
      addHabit(`Habit ${i}`, '#000000');
    }
    
    addHabit('11th Habit', '#ffffff');
    
    const { habits } = useHabitStore.getState();
    expect(habits).toHaveLength(10);
  });

  it('should delete a habit and cleanup records', () => {
    const { addHabit, toggleHabit, deleteHabit } = useHabitStore.getState();
    
    addHabit('Delete Me', '#000000');
    const habitId = useHabitStore.getState().habits[0].id;
    
    const today = '2026-01-13';
    toggleHabit(today, habitId);
    
    expect(useHabitStore.getState().records[0].completedHabitIds).toContain(habitId);
    
    deleteHabit(habitId);
    
    expect(useHabitStore.getState().habits).toHaveLength(0);
    expect(useHabitStore.getState().records[0].completedHabitIds).not.toContain(habitId);
  });

  describe('reorderHabits', () => {
    it('should reorder habits correctly', () => {
      const { addHabit, reorderHabits } = useHabitStore.getState();

      addHabit('Habit 1', '#FF0000');
      addHabit('Habit 2', '#00FF00');
      addHabit('Habit 3', '#0000FF');

      const habits = useHabitStore.getState().habits;
      const [habit1, habit2, habit3] = habits;

      reorderHabits(habit1.id, habit3.id);

      const reorderedHabits = useHabitStore.getState().habits;
      expect(reorderedHabits[0].id).toBe(habit2.id);
      expect(reorderedHabits[1].id).toBe(habit3.id);
      expect(reorderedHabits[2].id).toBe(habit1.id);
    });

    it('should do nothing if habit IDs are invalid', () => {
      const { addHabit, reorderHabits } = useHabitStore.getState();
      addHabit('Test Habit', '#FF0000');

      const habitsBefore = useHabitStore.getState().habits;
      reorderHabits('invalid-id', 'also-invalid');
      const habitsAfter = useHabitStore.getState().habits;

      expect(habitsAfter).toEqual(habitsBefore);
    });
  });
});
