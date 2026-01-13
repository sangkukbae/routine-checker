import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Habit } from '@/types/habit';

interface SortableHabitItemProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export function SortableHabitItem({ habit, onEdit, onDelete }: SortableHabitItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm group hover:shadow-md hover:border-gray-200 transition-all"
    >
      <div className="flex items-center gap-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded touch-none"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>
        <div
          className="w-5 h-5 rounded-full shadow-inner ring-4 ring-opacity-10"
          style={{ backgroundColor: habit.color }}
        />
        <span className="font-semibold text-gray-700">{habit.name}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-xl hover:bg-gray-100"
          onClick={() => onEdit(habit)}
        >
          <Edit2 className="w-4 h-4 text-gray-400" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-xl hover:bg-red-50 hover:text-red-500"
          onClick={() => onDelete(habit.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
