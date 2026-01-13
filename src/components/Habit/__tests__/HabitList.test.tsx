import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HabitList } from '../HabitList';
import { useHabitStore } from '@/store/useHabitStore';

describe('HabitList', () => {
  beforeEach(() => {
    useHabitStore.setState({ habits: [], records: [] });
  });

  it('renders empty state when no habits exist', () => {
    render(<HabitList />);
    expect(screen.getByText(/등록된 습관이 없습니다/)).toBeInTheDocument();
  });

  it('opens dialog when "습관 추가" button is clicked', () => {
    render(<HabitList />);
    const addButton = screen.getByText(/습관 추가/);
    fireEvent.click(addButton);
    
    expect(screen.getByText(/새 습관 추가/)).toBeInTheDocument();
  });

  it('displays added habits', () => {
    useHabitStore.setState({
      habits: [
        { id: '1', name: 'Exercise', color: '#ff0000', createdAt: Date.now() }
      ]
    });
    
    render(<HabitList />);
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.queryByText(/등록된 습관이 없습니다/)).not.toBeInTheDocument();
  });
});
