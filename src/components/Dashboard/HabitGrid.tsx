import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useHabitStore } from '../../store/useHabitStore';
import { GridCell } from './GridCell';
import './HabitGrid.css';

export const HabitGrid = () => {
  const { habits, records, toggleHabit, currentDate } = useHabitStore();
  const today = startOfToday();
  
  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
  }, [currentDate]);

  const getIsCompleted = (date: string, habitId: string) => {
    const record = records.find((r) => r.date === date);
    return record?.completedHabitIds.includes(habitId) || false;
  };

  return (
    <div 
      className="habit-grid-container"
      style={{ '--day-count': daysInMonth.length } as React.CSSProperties}
    >
      <div className="habit-grid-header">
        <div className="habit-name-placeholder" />
        {daysInMonth.map((day) => {
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const isSunday = day.getDay() === 0;
          return (
            <div 
              key={day.toISOString()} 
              className={`day-label ${isWeekend ? 'weekend' : ''} ${isSunday ? 'sunday' : ''}`}
            >
              <span className="day-number">{format(day, 'd')}</span>
              <span className="day-week">{format(day, 'E', { locale: ko })}</span>
            </div>
          );
        })}
      </div>

      <div className="habit-grid-body">
        {habits.map((habit) => (
          <div key={habit.id} className="habit-row">
            <div className="habit-name-label" style={{ color: habit.color }}>
              {habit.name}
            </div>
            {daysInMonth.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isDisabled = isBefore(day, today);
              
              return (
                <GridCell
                  key={`${habit.id}-${dateStr}`}
                  isCompleted={getIsCompleted(dateStr, habit.id)}
                  color={habit.color}
                  onClick={() => toggleHabit(dateStr, habit.id)}
                  disabled={isDisabled}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {habits.length === 0 && (
        <div className="empty-state">
          등록된 습관이 없습니다.
        </div>
      )}
    </div>
  );
};
