# Implementation Plan: UC02 - 일일 습관 체크 (Daily Habit Tracking)

## 1. 개요

사용자가 월별 그리드에서 각 날짜의 습관 완료 여부를 토글(체크/해제)하는 핵심 인터랙션을 구현합니다.

## 2. 제안된 변경 사항

### [State Management]

#### [MODIFY] [useHabitStore.ts](file:///Users/lguplus/Projects/routine-checker/src/store/useHabitStore.ts)

- `DailyRecord` 인터페이스 정의 (date: YYYY-MM-DD, completedHabitIds: string[]).
- `records` 배열 상태 추가.
- `toggleHabit(date, habitId)` 액션 추가:
  - 해당 날짜의 레코드가 없으면 생성.
  - 레코드가 있으면 `completedHabitIds`에서 `habitId` 존재 여부에 따라 추가 또는 제거.

### [UI Components]

#### [NEW] [HabitGrid.tsx](file:///Users/lguplus/Projects/routine-checker/src/components/Dashboard/HabitGrid.tsx)

- CSS Grid를 사용하여 왼쪽 열에는 습관 목록, 상단 행에는 날짜 표시.
- 각 교차 지점에 `GridCell` 렌더링.

#### [NEW] [GridCell.tsx](file:///Users/lguplus/Projects/routine-checker/src/components/Dashboard/GridCell.tsx)

- 개별 체크 박스 영역.
- **Animate UI 적용**:
  - `animate-ui`의 `Checkbox` 또는 커스텀 컴포넌트 활용.
  - 클릭 시 `framer-motion`을 이용한 탄성(Elastic) 애니메이션 및 색상 채우기 효과 적용.

## 3. 검증 계획

### 자동 테스트

- `toggleHabit` 로직 테스트: 동일 날짜 클릭 시 추가/제거 반복 확인.

### 수동 테스트

1. 임의의 날짜 셀 클릭 시 체크 표시 및 색상 변경 확인.
2. 재클릭 시 체크 해제되는지 확인.
3. 다른 달로 이동했다가 돌아왔을 때 체크 상태가 유지되는지 확인.
