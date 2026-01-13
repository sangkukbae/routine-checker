export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface DailyRecord {
  date: string;
  completedHabitIds: string[];
}
