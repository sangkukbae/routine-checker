import { format, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { Habit, DailyRecord } from '../types/habit';

export const calculateMonthlyStats = (habits: Habit[], records: DailyRecord[], date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start, end });
  
  if (habits.length === 0) return { totalCompletionRate: 0, habitStats: {} };

  let totalChecks = 0;
  const totalPossible = habits.length * daysInMonth.length;

  const habitStats: Record<string, number> = {};
  habits.forEach(habit => {
    let habitChecks = 0;
    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const record = records.find(r => r.date === dateStr);
      if (record?.completedHabitIds.includes(habit.id)) {
        habitChecks++;
      }
    });
    habitStats[habit.id] = habitChecks;
    totalChecks += habitChecks;
  });

  return {
    totalCompletionRate: Math.round((totalChecks / totalPossible) * 100),
    habitStats
  };
};

export const calculateCurrentStreak = (habitId: string, records: DailyRecord[]) => {
  let streak = 0;
  let checkDate = new Date(); 

  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  while (true) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    const record = sortedRecords.find(r => r.date === dateStr);
    
    if (record?.completedHabitIds.includes(habitId)) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      const isToday = isSameDay(checkDate, new Date());
      if (streak === 0 && isToday) {
        checkDate = subDays(checkDate, 1);
        continue;
      }
      break;
    }
  }

  return streak;
};
