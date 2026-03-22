# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development commands

- Use `pnpm` in this repo (`pnpm-lock.yaml` is committed).
- Install dependencies: `pnpm install`
- Start the dev server: `pnpm dev`
- Build for production: `pnpm build`
- Start the production server: `pnpm start`
- Run linting: `pnpm lint`
- Run a manual TypeScript check: `pnpm exec tsc --noEmit`
  - `next.config.mjs` sets `typescript.ignoreBuildErrors = true`, so `pnpm build` will not fail on TypeScript errors.
- Tests: there is currently no test runner or test suite configured in this repository.
  - No single-test command exists yet.

## Repository notes

- The repo is linked to v0. The README notes that v0 can push commits directly to this repository.
- The README also states that merges to `main` auto-deploy.

## Architecture overview

- This is a Next.js App Router application using React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Radix UI, and Recharts.
- Routing is defined under `app/`. `app/page.tsx` immediately redirects to `/dashboard`, so `/dashboard` is the effective landing page.
- `app/layout.tsx` is the global shell. It loads `app/globals.css`, sets metadata/icons, and mounts Vercel Analytics. There are no app-wide data providers in the root layout.
- The app is organized around delivery workflow roles rather than technical layers. The main route groups are:
  - `/dashboard`: overview screen
  - `/tasks`: executor-facing task list
  - `/dispatch`: assigner/supervisor dispatch board
  - `/dispatch/[id]`: multi-service assignment detail
  - `/workbench/[id]`: execution workbench
  - `/workbench/collab/[id]`: collaborative workbench
- `components/layout/` contains the shared application chrome. `DashboardLayout` composes the fixed sidebar and top header for the standard screens.
- The workbench pages use denser custom multi-pane layouts, but still reuse the shared sidebar.
- `components/ui/` contains the shadcn/ui component set. `components.json` defines the key aliases:
  - `@/components`
  - `@/components/ui`
  - `@/lib`
  - `@/hooks`
- `lib/utils.ts` provides the shared `cn()` helper for class merging.
- State management is mostly local React state inside each page (`useState` / `useEffect`). There is no Redux, Zustand, React Query, server-action workflow, or backend data layer wired in yet.
- Business data is currently mocked inline inside the route components. This repo behaves more like a UI prototype than a fully integrated production app.
- Several client pages use a `mounted` flag before rendering interactive content to avoid SSR/CSR hydration mismatches. Keep that pattern in mind when touching time-sensitive or browser-only UI.
- `hooks/use-toast.ts` is the main shared client-side stateful utility; it implements toast state with a module-level in-memory store rather than a provider.
- Styling is driven by Tailwind utilities and CSS variables in `app/globals.css`.
- Charts use the reusable wrapper in `components/ui/chart.tsx`.
- User-facing UI copy is largely Chinese, while route names and many component identifiers are English. Preserve that mixed convention unless asked to change it.

## Configuration details that matter

- `next.config.mjs` sets `images.unoptimized = true`.
- `tsconfig.json` defines the `@/*` path alias mapped to the repo root.
- There is no `app/api` directory or other backend integration layer in the current codebase.