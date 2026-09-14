# Glimmr

Glimmr is a local outing planner for Bengaluru. You tell it where you're going, how long you have, your budget, who's coming, and the kind of energy you're after — it gives you three distinct, editable outing plans.

## What it does

- Fill in a short form: starting area, destination, available time, budget per person, group size, transport mode, and mood
- Get three plan options, each a different shape of outing (best fit, best value, most adventurous)
- Open a plan and edit individual stops — swap a place, adjust timing, delete a stop, or add one
- Start an outing and track your stops as you go

V1 covers **Indiranagar, Bengaluru**.

## Tech stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Wouter, Framer Motion
- **Backend**: Express 5, Node.js (currently only a health check endpoint)
- **Database**: PostgreSQL + Drizzle ORM (schema in progress)
- **Tooling**: pnpm workspaces, Orval (API codegen from OpenAPI spec), esbuild

## Project structure

```
artifacts/glimmr/       # React frontend
artifacts/api-server/   # Express API
lib/api-spec/           # OpenAPI spec + Orval config
lib/api-client-react/   # Generated React Query hooks
lib/api-zod/            # Generated Zod schemas
lib/db/                 # Drizzle schema + connection
scripts/                # Workspace utility scripts
```

## Getting started

Install dependencies (requires [pnpm](https://pnpm.io)):

```bash
pnpm install
```

Run the frontend:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/glimmr run dev
```

Run the API server:

```bash
pnpm --filter @workspace/api-server run dev
```

Type-check the entire workspace:

```bash
pnpm run typecheck
```

Build everything:

```bash
pnpm run build
```

## Environment variables

| Variable       | Required | Description                        |
|----------------|----------|------------------------------------|
| `DATABASE_URL` | Yes      | PostgreSQL connection string       |
| `PORT`         | No       | Port for frontend/API (default: 5173) |
| `BASE_PATH`    | No       | Vite base path (default: `/`)      |

## Key files

| File | Purpose |
|------|---------|
| `artifacts/glimmr/src/pages/` | Route components (home, planner, results, plan detail, outing) |
| `artifacts/glimmr/src/data/places.ts` | Place dataset for Indiranagar |
| `artifacts/glimmr/src/services/glimmrService.ts` | Service layer (mock data today, API later) |
| `artifacts/glimmr/src/lib/recommendationEngine.ts` | Plan scoring and generation algorithm |
| `artifacts/glimmr/src/types/glimmr.ts` | Shared domain types |
| `artifacts/glimmr/src/components/glimmr-ui.tsx` | Core product UI components |
| `artifacts/glimmr/src/index.css` | Design tokens, typography, layout |

## Notes

- The frontend runs entirely on mock data for now. The service layer in `glimmrService.ts` is designed to be replaced with real API calls without touching the page components.
- Plan edits recalculate cost, duration, travel time, distance, and feasibility in one place.
- The 3D landing visual (`route-three.tsx`) uses React Three Fiber with a plain SVG fallback for environments without WebGL.
