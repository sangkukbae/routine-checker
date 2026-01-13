import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useHabitStore } from '@/store/useHabitStore';
import { Button } from '@/components/ui/button';
import { HabitDialog } from './HabitDialog';
import { SortableHabitItem } from './SortableHabitItem';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Habit } from '@/types/habit';

export function HabitList() {
  const habits = useHabitStore((state) => state.habits);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const reorderHabits = useHabitStore((state) => state.reorderHabits);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderHabits(active.id as string, over.id as string);
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingHabit(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">내 습관 ({habits.length}/10)</h2>
        <Button
          onClick={handleAdd}
          disabled={habits.length >= 10}
          size="sm"
          className="rounded-full shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          습관 추가
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={habits.map((h) => h.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-2 relative">
            <AnimatePresence mode="popLayout">
              {habits.map((habit) => (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <SortableHabitItem
                    habit={habit}
                    onEdit={handleEdit}
                    onDelete={deleteHabit}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {habits.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 bg-gray-50/50"
              >
                <div className="mb-2 text-2xl">✨</div>
                <p className="font-medium text-gray-500">등록된 습관이 없습니다.</p>
                <p className="text-sm">첫 번째 습관을 추가하고 루틴을 시작해보세요!</p>
              </motion.div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <HabitDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        habit={editingHabit}
      />
    </div>
  );
}

