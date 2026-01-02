# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pomodoro Timer application built with Next.js 16, TypeScript, and Tailwind CSS. The app implements the Pomodoro Technique with work sessions (25 minutes) and break sessions. It features a clean, dark-themed UI with timer functionality and navigation between different timer states.

## Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint with custom quote rules
```

### Code Quality
- ESLint is configured with Next.js rules plus a custom rule enforcing single quotes
- TypeScript is configured with strict mode and path aliases (`@/*` points to project root)

## Architecture

### Route Structure
The app uses Next.js App Router with a nested layout structure:
- `app/layout.tsx` - Root layout with Geist fonts and Japanese locale
- `app/(public)/layout.tsx` - Public pages layout with Major Mono Display font for timer aesthetics
- `app/(public)/timer/` - Timer-related pages:
  - `work/page.tsx` - 25-minute work timer
  - `break/page.tsx` - Break timer
  - `completion/page.tsx` - Timer completion screen with navigation logic

### Component Structure
```
components/
├── ui/                 # shadcn/ui components (button.tsx)
└── timer/             # Timer-specific components
    ├── useTimer.ts    # Custom hook for timer logic
    ├── TimerDisplay.tsx
    └── TimerControls.tsx
```

### State Management
- Uses React's built-in state management with custom hooks
- `useTimer` hook manages timer state (time left, running status, controls)
- Navigation state managed through Next.js router and URL search params

### Timer Flow
1. Work timer (`/timer/work`) - 25 minutes
2. Completion page (`/timer/completion?isWork=true`) - Shows work completion
3. Break timer (`/timer/break`) - Auto-starts if navigated from completion
4. Completion page (`/timer/completion?isWork=false`) - Shows break completion

### Key Features
- Auto-start functionality via URL parameters (`autoStart=true`)
- Automatic navigation on timer completion
- URL parameter cleanup to prevent unwanted re-execution
- Responsive design with dark theme

## Development Guidelines

### Code Style
- **Quotes**: Use single quotes (enforced by ESLint)
- **Imports**: Use `@/` path alias for internal imports
- **Fonts**: Major Mono Display for timer UI, Geist for general content
- **Locale**: Japanese (`lang="ja"` in root layout)

### shadcn/ui Integration
- Configured with "new-york" style, Lucide icons, neutral base color
- Components use Tailwind CSS variables and are RSC-compatible
- Path aliases configured for easy component imports

### Timer Implementation Details
- Uses `useRef` for interval management to avoid re-render issues
- Timer logic in `useTimer.ts:19-42` handles start/stop/reset functionality
- Auto-completion navigation in work/break pages triggers at `timeLeft === 0`
- Search params used for auto-start and state passing between pages

### UI Components
- Dark theme with `bg-black text-white` throughout timer pages
- Responsive layout using Tailwind flex utilities
- Custom timer display components with work/break state awareness

## File Organization

- Timer logic: `components/timer/useTimer.ts`
- Page components: `app/(public)/timer/[type]/page.tsx`
- UI components: `components/ui/` (shadcn/ui)
- Styling: `app/globals.css` with Tailwind
- Type definitions: Standard TypeScript with `@/` path mapping