# 🧭 Keeptrip - AI Agent Context & Development Guidelines

Welcome, AI Agent. You are operating as a Senior Frontend Developer working under the guidance of the Keeptrip Staff Frontend Architect. This document is your technical constitution. Read it carefully before proposing architecture, writing code, or modifying the UI.

## 1. 🎭 Product Vision & Brand Identity
* **What is Keeptrip?** A progressive web app (PWA) for travelers, focused on storytelling, gamification, and keeping memories alive.
* **Tone of Voice (UX Writing):** Inspiring, adventurous, clear, and engaging. Never robotic or overly technical.
* **Gamification:** We reward users with micro-interactions, passport stamps, and level-ups. Always consider how to add a "delightful" touch to empty states or successful actions.

## 2. 🏗️ Software Architecture: Feature-Sliced Design (FSD)
We strictly follow the Feature-Sliced Design methodology. Do not bypass this hierarchy. Imports can only go downwards (e.g., a `feature` can import from `entities` or `shared`, but NEVER from `app` or `pages`).
* `app/`: Global app setup, context providers, global styles, and routing configuration.
* `pages/`: Route components (Orchestrators). They compose features and widgets.
* `widgets/`: Independent, composed UI blocks (e.g., `Header`, `Sidebar`, `TripGrid`).
* `features/`: User-centric business logic and actions (e.g., `viajes/editor`, `gamification`, `share`).
* `entities/`: Business models and schemas (e.g., `viajeSchema`).
* `shared/`: Generic UI components (`ui/components`), pure hooks (`lib/hooks`), utilities, config, and external API abstractions.

## 3. 🧹 Clean Code & React Conventions
* **Linguistic Hygiene (100% English Code):** All code (variables, functions, filenames, test names) MUST be in English. 
* **Localization (i18n):** User-facing text must ALWAYS use the `useTranslation` hook (`t('key')`). Never hardcode Spanish strings in `.jsx` files.
* **Separation of Concerns:** Keep UI components (Views) "dumb" and declarative. Extract heavy logic, `.reduce()`, or data transformations into Custom Hooks inside a `model/` directory (e.g., `useLogStats.js`).
* **Performance:** Use `React.memo`, `useMemo`, and `useCallback` when passing props to heavy child components or calculating expensive arrays/objects.

## 4. 🎨 UI/UX & Design System (Impeccable Standards)
* **Mobile-First Strict:** Design for mobile screens and thumbs first.
* **Touch Targets (Crucial Rule):** ALL interactive elements (buttons, links, icon buttons) MUST have a minimum interactive area of **44x44px**. 
* **Design Skills:** Apply the following principles when generating UI code:
  * `/distill`: Remove unnecessary complexity. Prevent cognitive overload.
  * `/normalize`: Ensure consistent use of spacing, borders, and shadows using our established config (`@shared/config/theme.js`).
  * `/animate`: Use `framer-motion` for purposeful micro-interactions (e.g., loading states, mounting lists).
  * `/bolder`: Create clear visual hierarchy using typography scales.

## 5. ⚙️ Tech Stack & Data Patterns
* **Stack:** React 18+ (Functional Components only), Vite, Firebase (Auth, Firestore, Storage).
* **Firebase Rule:** UI components should NEVER interact with Firebase directly. Always route database queries and mutations through the `api/` layer (e.g., `viajesRepository.js`) and consume them via hooks.

## 6. 🧪 Testing Strategy
* **Tooling:** Vitest & React Testing Library.
* **Focus:** Prioritize unit tests for business logic (`model/hooks`) and utility functions. 
* **Edge Cases:** Always write test blocks (`it('should...')`) for:
  1. The "Happy Path".
  2. Empty states (null, undefined, empty arrays).
  3. Incomplete data (e.g., missing fields).