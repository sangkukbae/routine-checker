import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HabitGrid } from '../HabitGrid';
import { useHabitStore } from '@/store/useHabitStore';
import { format, subDays } from 'date-fns';

describe('HabitGrid', () => {
  beforeEach(() => {
    useHabitStore.setState({ habits: [], records: [], currentDate: new Date() });
    vi.useFakeTimers();
  });

  it('renders "등록된 습관이 없습니다." when no habits exist', () => {
    render(<HabitGrid />);
    expect(screen.getByText(/등록된 습관이 없습니다/)).toBeInTheDocument();
  });

  it('renders habit names when habits exist', () => {
    useHabitStore.setState({
      habits: [
        { id: '1', name: 'Exercise', color: '#ff0000', createdAt: Date.now() }
      ]
    });
    
    render(<HabitGrid />);
    expect(screen.getByText('Exercise')).toBeInTheDocument();
  });

  it('disables past dates', () => {
    const today = new Date('2024-01-10');
    vi.setSystemTime(today);
    
    useHabitStore.setState({
      habits: [
        { id: '1', name: 'Exercise', color: '#ff0000', createdAt: Date.now() }
      ],
      currentDate: today
    });

    const { container } = render(<HabitGrid />);
    
    const cells = container.querySelectorAll('.grid-cell');
    
    const jan9Cell = cells[8];
    expect(jan9Cell).toHaveClass('disabled');

    const jan10Cell = cells[9];
    expect(jan10Cell).not.toHaveClass('disabled');
  });
});
