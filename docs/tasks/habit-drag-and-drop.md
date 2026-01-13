# 습관 드래그 앤 드롭 순서 변경 기능 구현 계획

## 개요

`HabitList.tsx`에서 습관을 드래그 앤 드롭으로 순서를 변경하고, 변경된 순서가 `HabitGrid.tsx`에 반영되도록 구현합니다.

## 기술 조사 결과

### 라이브러리 선택: @dnd-kit

**선택 이유:**
- `react-beautiful-dnd`는 Atlassian에서 2022년에 공식 deprecated됨
- `@dnd-kit`는 현재 가장 활발히 유지되는 현대적인 드래그 앤 드롭 라이브러리
- TypeScript 완벽 지원
- 가볍고 성능이 우수함
- 커스터마이징이 용이함

**참고 자료:**
- [dnd-kit 공식 문서](https://docs.dndkit.com/presets/sortable)
- [useSortable Hook 문서](https://docs.dndkit.com/presets/sortable/usesortable)
- [@dnd-kit/sortable npm](https://www.npmjs.com/package/@dnd-kit/sortable)

### 필요 패키지
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## 구현 단계

### Step 1: 패키지 설치

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**검증:** `package.json`에 패키지가 추가되었는지 확인

---

### Step 2: Zustand Store에 reorderHabits 액션 추가

**파일:** `src/store/useHabitStore.ts`

**변경 내용:**
1. `HabitState` 인터페이스에 `reorderHabits` 액션 타입 추가
2. `reorderHabits(activeId: string, overId: string)` 액션 구현

**구현 코드:**
```typescript
// HabitState 인터페이스에 추가
reorderHabits: (activeId: string, overId: string) => void;

// store 구현에 추가
reorderHabits: (activeId, overId) =>
  set((state) => {
    const oldIndex = state.habits.findIndex((h) => h.id === activeId);
    const newIndex = state.habits.findIndex((h) => h.id === overId);

    if (oldIndex === -1 || newIndex === -1) return state;

    const newHabits = [...state.habits];
    const [movedHabit] = newHabits.splice(oldIndex, 1);
    newHabits.splice(newIndex, 0, movedHabit);

    return { habits: newHabits };
  }),
```

**검증:** 단위 테스트 작성하여 순서 변경 로직 검증

---

### Step 3: SortableHabitItem 컴포넌트 생성

**파일:** `src/components/Habit/SortableHabitItem.tsx` (새 파일)

**구현 내용:**
- `useSortable` 훅을 사용하여 드래그 가능한 습관 아이템 구현
- 기존 `HabitList.tsx`의 habit 아이템 UI를 분리
- 드래그 핸들(GripVertical 아이콘) 추가

**구현 코드:**
```tsx
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
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
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
```

---

### Step 4: HabitList.tsx에 드래그 앤 드롭 컨텍스트 추가

**파일:** `src/components/Habit/HabitList.tsx`

**변경 내용:**
1. `DndContext`, `SortableContext` 임포트
2. 센서 설정 (PointerSensor, KeyboardSensor)
3. `handleDragEnd` 이벤트 핸들러 구현
4. 기존 `motion.div` 습관 아이템을 `SortableHabitItem`으로 교체
5. Framer Motion의 `AnimatePresence`와 dnd-kit 통합

**구현 코드:**
```tsx
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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
```

---

### Step 5: HabitGrid.tsx 순서 반영 확인

**파일:** `src/components/Dashboard/HabitGrid.tsx`

**변경 내용:** 없음 (자동 반영)

**이유:**
- `HabitGrid`는 이미 `useHabitStore`의 `habits` 배열을 직접 사용
- Zustand store의 `habits` 배열 순서가 변경되면 자동으로 반영됨
- 별도의 코드 변경 불필요

**검증:**
- 습관 순서 변경 후 그리드에서 행 순서가 동일하게 변경되는지 확인

---

### Step 6: 테스트 작성

**파일:** `src/store/__tests__/useHabitStore.test.ts`

**추가할 테스트:**
```typescript
describe('reorderHabits', () => {
  it('should reorder habits correctly', () => {
    const store = useHabitStore.getState();

    // 3개의 습관 추가
    store.addHabit('Habit 1', '#FF0000');
    store.addHabit('Habit 2', '#00FF00');
    store.addHabit('Habit 3', '#0000FF');

    const habits = useHabitStore.getState().habits;
    const [habit1, habit2, habit3] = habits;

    // 첫 번째를 세 번째로 이동
    store.reorderHabits(habit1.id, habit3.id);

    const reorderedHabits = useHabitStore.getState().habits;
    expect(reorderedHabits[0].id).toBe(habit2.id);
    expect(reorderedHabits[1].id).toBe(habit3.id);
    expect(reorderedHabits[2].id).toBe(habit1.id);
  });

  it('should do nothing if habit IDs are invalid', () => {
    const store = useHabitStore.getState();
    store.addHabit('Test Habit', '#FF0000');

    const habitsBefore = useHabitStore.getState().habits;
    store.reorderHabits('invalid-id', 'also-invalid');
    const habitsAfter = useHabitStore.getState().habits;

    expect(habitsAfter).toEqual(habitsBefore);
  });
});
```

**파일:** `src/components/Habit/__tests__/HabitList.test.tsx`

**추가할 테스트:**
- 드래그 핸들이 렌더링되는지 확인
- 습관 목록이 올바르게 렌더링되는지 확인

---

### Step 7: 스타일 및 UX 개선

**개선 사항:**
1. 드래그 중 시각적 피드백 (opacity, scale)
2. 드래그 핸들 hover 효과
3. 터치 디바이스 지원 확인
4. 키보드 접근성 확인 (Tab, Space, Arrow keys)

**선택적 개선:**
- DragOverlay 컴포넌트 추가하여 드래그 중 프리뷰 개선
- 드래그 중 다른 아이템의 애니메이션 부드럽게 조정

---

## 파일 변경 요약

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `package.json` | 수정 | @dnd-kit 패키지 추가 |
| `src/store/useHabitStore.ts` | 수정 | reorderHabits 액션 추가 |
| `src/components/Habit/SortableHabitItem.tsx` | 신규 | 드래그 가능한 습관 아이템 |
| `src/components/Habit/HabitList.tsx` | 수정 | DndContext, SortableContext 적용 |
| `src/store/__tests__/useHabitStore.test.ts` | 수정 | reorderHabits 테스트 추가 |

---

## 예상 소요 시간

| 단계 | 예상 작업량 |
|------|------------|
| Step 1: 패키지 설치 | 간단 |
| Step 2: Store 액션 추가 | 간단 |
| Step 3: SortableHabitItem | 중간 |
| Step 4: HabitList 수정 | 중간 |
| Step 5: 검증 | 간단 |
| Step 6: 테스트 작성 | 중간 |
| Step 7: UX 개선 | 선택적 |

---

## 참고 자료

- [Top 5 Drag-and-Drop Libraries for React in 2025](https://dev.to/puckeditor/top-5-drag-and-drop-libraries-for-react-24lb)
- [dnd-kit 공식 문서 - Sortable](https://docs.dndkit.com/presets/sortable)
- [useSortable Hook 문서](https://docs.dndkit.com/presets/sortable/usesortable)
- [@dnd-kit/sortable npm](https://www.npmjs.com/package/@dnd-kit/sortable)
- [react-beautiful-dnd 지원 종료 안내](https://github.com/atlassian/react-beautiful-dnd)
