# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Routine Checker is a React-based web application for tracking daily habits with monthly grid visualization. Users can track up to 10 habits per day and view their progress in a calendar-style interface.

**Tech Stack:**
- React 19 + TypeScript + Vite
- Zustand for state management with localStorage persistence
- Tailwind CSS + shadcn/ui components
- Framer Motion for animations
- date-fns for date utilities
- Vitest for testing

## Development Commands

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npx vitest

# Run tests with UI
npx vitest --ui

# Run tests in watch mode
npx vitest watch

# Run single test file
npx vitest src/path/to/test.test.ts
```

## Architecture

### State Management (Zustand)

The application uses a single Zustand store (`src/store/useHabitStore.ts`) with localStorage persistence:

- **State:**
  - `habits: Habit[]` - List of habits (max 10)
  - `records: DailyRecord[]` - Daily completion records
  - `currentDate: Date` - Currently displayed month
  - `_hasHydrated: boolean` - Hydration status for persistence

- **Actions:**
  - `addHabit(name, color)` - Add new habit (enforces 10-habit limit)
  - `updateHabit(id, updates)` - Update habit properties
  - `deleteHabit(id)` - Delete habit and its records
  - `toggleHabit(date, habitId)` - Toggle habit completion for a date
  - `setMonth(offset)` - Navigate months (+1 or -1)
  - `setHasHydrated(state)` - Track hydration status

**Persistence:** Only `habits` and `records` are persisted to localStorage under the key `routine-checker-storage`. The `currentDate` is not persisted and resets to today on each session.

### Data Models

```typescript
interface Habit {
  id: string;           // Generated with crypto.randomUUID()
  name: string;         // Habit name
  color: string;        // Hex color code
  createdAt: number;    // Unix timestamp
}

interface DailyRecord {
  date: string;                    // YYYY-MM-DD format
  completedHabitIds: string[];     // Array of completed habit IDs
}
```

### Component Structure

```
App.tsx (Root)
├── HabitList (src/components/Habit/)
│   ├── HabitDialog - Add/edit habit modal
│   └── ColorPicker - Color selection component
├── StatsPanel (src/components/Dashboard/)
│   └── Displays monthly completion rate and streak stats
├── MonthNavigation (src/components/Dashboard/)
│   └── Month navigation controls
└── HabitGrid (src/components/Dashboard/)
    └── GridCell - Individual date/habit checkbox cells
```

### Utility Functions

`src/lib/habit-utils.ts` provides:
- `calculateMonthlyStats(habits, records, date)` - Calculate completion rate and per-habit stats for a month
- `calculateCurrentStreak(habitId, records)` - Calculate current streak for a habit (allows today to be incomplete)

### Path Aliasing

The `@` alias resolves to `./src` (configured in `vite.config.ts` and `vitest.config.ts`):
```typescript
import { Button } from '@/components/ui/button';
```

## Testing

Tests use Vitest with React Testing Library:
- Test files: `**/*.test.ts` and `**/*.test.tsx`
- Setup file: `src/test/setup.ts` (imports @testing-library/jest-dom)
- Environment: jsdom
- Globals enabled: Can use `describe`, `it`, `expect` without imports

Test coverage includes:
- Store logic (`src/store/__tests__/`)
- Utility functions (`src/lib/habit-utils.test.ts`)
- Components (`src/components/**/__tests__/`)

## Key Implementation Details

### Habit Limit
The store enforces a maximum of 10 habits. The `addHabit` action returns early if this limit is reached.

### Date Handling
- All dates are formatted as `YYYY-MM-DD` strings using `date-fns/format`
- The grid displays the full month based on `currentDate` in the store
- Month navigation uses `addMonths` from date-fns with offset parameter

### Persistence Hydration
Components should check `_hasHydrated` before rendering data-dependent UI to avoid hydration mismatches:
```typescript
const hasHydrated = useHabitStore((state) => state._hasHydrated);
if (!hasHydrated) return null;
```

### Styling Conventions
- Uses Tailwind CSS utility classes
- shadcn/ui components in `src/components/ui/`
- Custom colors defined per habit (stored in hex format)
- Responsive design with mobile-first approach
- Animations via Framer Motion for micro-interactions

### Grid Layout
The habit grid is a CSS Grid layout where:
- Rows represent habits
- Columns represent days of the month
- Each cell is clickable to toggle habit completion
- Past dates can be edited within the current month view

## Project Documentation

See `/docs` directory for detailed specifications:
- `prd.md` - Product Requirements (in Korean)
- `trd.md` - Technical Requirements (in Korean)
- `use-cases/` - Use case documentation
- `plans/` - Implementation plans
