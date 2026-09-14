# GLIMMR Outing Planner

GLIMMR turns a destination, time window, budget, group, transport mode, and mood into a flexible local outing plan.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/glimmr/src/pages/` contains the landing, planner, results, plan detail, and active outing routes.
- `artifacts/glimmr/src/data/mockData.ts` is the current realistic sample dataset.
- `artifacts/glimmr/src/services/glimmrService.ts` is the mock service boundary to replace with API calls later.
- `artifacts/glimmr/src/types/glimmr.ts` is the shared domain model for planner requests, places, plans, edits, and outings.
- `artifacts/glimmr/src/components/glimmr-ui.tsx` contains reusable product UI and plan editing primitives.
- `artifacts/glimmr/src/components/route-three.tsx` contains the decorative landing visual with a reduced-motion and non-WebGL fallback.
- `artifacts/glimmr/src/index.css` is the source of truth for GLIMMR typography, color tokens, spacing, and responsive layout.

## Architecture decisions

- The first build is frontend-first with realistic mock data behind a service abstraction so API integration can replace the data source without changing route components.
- Plan edits recalculate cost, total duration, travel time, distance, and feasibility in one service boundary.
- The landing illustration uses React Three Fiber as a decorative enhancement but always keeps an SVG route fallback so the CTA and page remain usable without WebGL.
- Wouter provides lightweight route handling for the defined product paths while preserving a shared header and error boundary.

## Product

- Users can shape an outing request, compare three distinct plans, open a plan, start an outing, and modify individual stops.
- The plan editor supports changing timing, replacing a place, adding a stop, deleting a stop, and submitting a natural-language instruction.
- Results and edit flows expose meaningful loading, error, empty, and recalculation states.

## User preferences

 - Keep GLIMMR feeling like a decision-making assistant, not a directory, dashboard, or generic chatbot.

## Gotchas

- The GLIMMR artifact workflow supplies `PORT` and `BASE_PATH`; use the managed workflow rather than starting Vite directly.
- The API server is not required by the current mock-data build.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
