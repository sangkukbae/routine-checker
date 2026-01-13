# Technical Requirements Document (TRD): Routine Checker

## 1. 개요 (Introduction)

본 문서는 "루틴 체커" 프로젝트의 실제 구현을 위한 기술 규격서입니다. 개발 효율과 사용자 경험(애니메이션)에 최적화된 기술 스택을 정의하고, 데이터 구조 및 컴포넌트 설계를 명시합니다.

## 2. 기술 스택 (Core Tech Stack)

| 분류                 | 기술                       | 비고                                 |
| :------------------- | :------------------------- | :----------------------------------- |
| **Framework**        | React 18+ (Vite)           | 빠른 빌드 및 HMR 지원                |
| **Language**         | TypeScript                 | 타입 안정성 확보                     |
| **State Management** | Zustand                    | 가볍고 직관적인 중앙 상태 관리       |
| **Styling**          | Tailwind CSS + shadcn/ui   | 유틸리티 기반 개발 및 고품질 UI 제공 |
| **Animations**       | Animate UI + Framer Motion | 마이크로 애니메이션 및 컴포넌트 효과 |
| **Persistence**      | Window.localStorage        | 브라우저 내 데이터 유지              |

## 3. 데이터 아키텍처 (Data Architecture)

데이터는 JSON 형태로 관리되며, LocalStorage에 직렬화되어 저장됩니다.

### 3.1 Habit 모델

```typescript
interface Habit {
	id: string;
	name: string;
	color: string;
	createdAt: number;
}
```

### 3.2 Daily Record 모델

```typescript
interface DailyRecord {
	date: string; // YYYY-MM-DD
	completedHabitIds: string[]; // 해당 날짜에 완료된 Habit ID 목록
}
```

### 3.3 Zustand Store 구조

- `habits: Habit[]`
- `records: DailyRecord[]`
- `actions`: 습관 추가/삭제, 완료 상태 토글 (Check/Uncheck)

## 4. 컴포넌트 설계 (UI Architecture)

shadcn/ui를 기반으로 구축하며, 애니메이션이 필요한 부분에 Animate UI를 적용합니다.

### 4.1 주요 컴포넌트 계층

1.  **Layout**: 전체 레이아웃 (Header, Main Content)
2.  **Dashboard**: 한 달 핵심 뷰
    - `MonthPicker`: 월 이동 컨트롤
    - `HabitGrid`: 메인 월별 그리드 (Row: Habits, Column: Days)
      - `GridCell`: 개별 습관 체크 항목 (Animate UI 효과 적용)
3.  **HabitManagement**: 습관 목록 관리 및 추가/수정 모달
4.  **Stats**: 달성률 및 스트릭 표시 위젯

### 4.2 애니메이션 전략

- **Check In/Out**: 체크 시 Animate UI의 Elastic 효과 또는 스케일 변화 애니메이션 적용.
- **Month Transition**: 월 변경 시 슬라이드 또는 페이드 효과.
- **List Interaction**: 습관 추가/삭제 시 리스트 리오더링(Reordering) 애니메이션.

## 5. 데이터 영속성 (Persistence Layer)

- `zustand/middleware`의 `persist` 기능을 사용하여 LocalStorage와 상태를 자동 동기화합니다.
- Key: `routine-checker-storage`

## 6. 개발 단계별 가이드 (Implementation Steps)

### Step 1: 프로젝트 설정

- `npm create vite@latest routine-checker -- --template react-ts`
- Tailwind CSS 및 shadcn/ui 초기화
- Animate UI 라이브러리 연동 (Framer Motion 포함)

### Step 2: 상태 관리 모델링

- Zustand Store 정의 (Habits, Records)
- LocalStorage 연동 및 초기 데이터 마이그레이션 로직 작성

### Step 3: 핵심 UI - 그리드 개발

- CSS Grid/Flex를 활용한 월별 레이아웃 구성
- 날짜별/습관별 렌더링 최적화

### Step 4: 애니메이션 및 인터랙션

- Animate UI 컴포넌트 적용 (체크박스, 버튼 등)
- 마이크로 인터랙션 디테일 폴리싱

### Step 5: 배포 및 최적화

- Build 테스트 및 Lighthouse 성능 측정
- Vercel/Netlify 등을 통한 배포 설정
