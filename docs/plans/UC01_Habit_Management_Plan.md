# Implementation Plan: UC01 - 습관 관리 (Habit Management)

## 1. 개요

사용자가 본인의 습관(최대 10개)을 등록, 수정, 삭제할 수 있는 기능을 구현합니다. 이 기능은 시스템의 핵심 데이터인 `Habit` 객체를 생성하고 관리합니다.

## 2. 제안된 변경 사항

### [State Management]

#### [MODIFY] [useHabitStore.ts](file:///Users/lguplus/Projects/routine-checker/src/store/useHabitStore.ts)

- `Habit` 인터페이스 정의 (id, name, color, createdAt).
- `habits` 배열 상태 추가.
- `addHabit(name, color)`: UUID를 생성하여 새로운 습관 추가 (최대 10개 제한 로직 포함).
- `updateHabit(id, updates)`: 기존 습관 정보 수정.
- `deleteHabit(id)`: 습관 삭제 및 연관된 `DailyRecord` 정리.

### [UI Components]

#### [NEW] [HabitDialog.tsx](file:///Users/lguplus/Projects/routine-checker/src/components/Habit/HabitDialog.tsx)

- shadcn/ui의 `Dialog` 컴포넌트를 활용하여 추가/수정 폼 구현.
- `Input` (이름), `ColorPicker` (색상 선택) 포함.

#### [NEW] [HabitList.tsx](file:///Users/lguplus/Projects/routine-checker/src/components/Habit/HabitList.tsx)

- 현재 등록된 습관 목록 표시.
- 각 항목에 수정/삭제 버튼 배치.
- Animate UI의 `LayoutGroup` 또는 `Reorder` 컴포넌트를 사용하여 리스트 변화 시 애니메이션 적용.

## 3. 검증 계획

### 자동 테스트

- Zustand store unit test: 10개 초과 시 추가 방지 로직 검증.
- Habit CRUD 헬퍼 함수 검증.

### 수동 테스트

1. 습관 추가 버튼 클릭 후 정보 입력하여 저장. 리스트에 즉시 반영되는지 확인.
2. 기존 습관 수정 시 색상과 이름이 반영되는지 확인.
3. 습관 삭제 시 확인 모달 표시 및 삭제 후 그리드에서 해당 행이 사라지는지 확인.
4. 10개 등록 후 추가 버튼 비활성화 또는 경고 문구 확인.
