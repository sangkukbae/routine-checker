# Implementation Plan: UC03 - 월간 진행 검토 (Monthly Review & Visualization)

## 1. 개요

사용자가 현재 월의 성과를 확인하고, 다른 달로 이동하여 과거 기록을 검토할 수 있는 대시보드 기능을 구현합니다.

## 2. 제안된 변경 사항

### [State Management]

#### [MODIFY] [useHabitStore.ts](file:///Users/lguplus/Projects/routine-checker/src/store/useHabitStore.ts)

- `currentDate` (Date 객체 또는 YYYY-MM 형식 문자열) 상태 추가.
- `setMonth(offset)`: +/- 1개월 이동 액션.

### [UI Components]

#### [NEW] [MonthNavigation.tsx](file:///Users/lguplus/Projects/routine-checker/src/components/Dashboard/MonthNavigation.tsx)

- 현재 년/월 표시 및 이동 버튼 (<, >).
- shadcn/ui의 `Button` 활용.

#### [NEW] [StatsPanel.tsx](file:///Users/lguplus/Projects/routine-checker/src/components/Dashboard/StatsPanel.tsx)

- 월간 총 달성률 (완료된 셀 수 / 전체 셀 수).
- 각 습관별 현재 스트릭(공식: 오늘부터 역순으로 끊기지 않은 날짜 수) 계산 및 표시.
- Animate UI의 `NumberTicker` 등을 사용하여 수치 변화 시 애니메이션 효과.

#### [MODIFY] [HabitGrid.tsx](file:///Users/lguplus/Projects/routine-checker/src/components/Dashboard/HabitGrid.tsx)

- `currentDate`에 기반하여 해당 월의 날짜 수만큼 열 생성 로직 추가.

## 3. 검증 계획

### 자동 테스트

- 날짜 계산 유틸리티 함수 테스트 (해당 월의 총 일수 계산 등).
- 스트릭 계산 로직 엣지 케이스 테스트.

### 수동 테스트

1. 월 이동 버튼 클릭 시 날짜 레이블 및 체크 데이터가 월에 맞게 변경되는지 확인.
2. 체크 시 상단의 전체 달성률 퍼센티지가 실시간으로 올라가는지 확인.
3. 연속으로 체크했을 때 스트릭 숫자가 증가하는지 확인.
