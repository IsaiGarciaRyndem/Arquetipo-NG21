# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build
npm test           # Run all Jest tests
npm run lint       # ESLint check
npm run lint:fix   # ESLint auto-fix
npm run lint:css   # Stylelint check
npm run lint:css:fix  # Stylelint auto-fix
npm run format     # Prettier format all files
```

To run a single test file:

```bash
npx jest src/app/store/app/index.spec.ts
```

To run tests matching a pattern:

```bash
npx jest --testNamePattern="debe setear"
```

## Architecture

This is an Angular 21+ standalone-only archetype following **Clean Architecture / DDD-light** principles. There are no Angular modules — everything uses providers functions and standalone components.

### Layer Structure

```
src/app/
├── core/          # Singleton services, guards, interceptors, global facades
├── shared/        # Pure, stateless components, pipes, directives, utilities
├── features/      # Domain-driven feature slices (lazy-loaded)
└── store/         # Root NgRx store (global state only)
```

### Data Flow

```
Component → Facade → Store/Effects → Service → API
```

UI components never interact with the NgRx store directly — they go through facades. This decouples the UI from the state management implementation.

### Feature Structure

Each feature under `features/` should follow:

```
features/<domain>/
├── pages/          # Route-level components
├── components/     # Feature-specific components
├── store/          # actions, reducer, effects, selectors, state
├── services/       # Domain HTTP/business services
├── facades/        # Facade classes (bridge between UI and store)
├── models/         # Domain interfaces/types
├── routes.ts       # Feature routes with providers
└── index.ts        # Public API barrel
```

Feature routes use lazy loading with `loadComponent` and inject feature providers via the `providers` array on the route.

### Global Store

The root `AppState` holds only cross-cutting state (auth, session, settings). Meta-reducers handle:

- **Dev**: `loggerMetaReducerFactory` — logs all actions to console
- **Prod**: `createStorageSyncMetaReducer` — persists selected slices to `localStorage`

Configured in `src/app/store/reducers/index.ts`.

### Path Aliases (tsconfig)

| Alias            | Maps to              |
| ---------------- | -------------------- |
| `@appCore/*`     | `src/app/core/*`     |
| `@appShared/*`   | `src/app/shared/*`   |
| `@appFeatures/*` | `src/app/features/*` |
| `@appStore/*`    | `src/app/store/*`    |
| `@env/*`         | `src/environments/*` |

### Key Conventions

- **Strict TypeScript** — `strict: true`, `strictTemplates: true`, `noImplicitOverride: true`
- **SCSS** — alphabetical property order enforced by Stylelint
- **Prettier** — single quotes, trailing commas, print width 100 (128 for HTML/SCSS)
- **Lint-staged** runs on every commit via Husky: Prettier → ESLint → Stylelint
- **NgRx runtime checks** — all strict checks enabled; state and actions must be serializable
- Store devtools are enabled only in dev mode (`isDevMode()`)
