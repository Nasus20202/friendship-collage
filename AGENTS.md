# Agent Guide

## Project Shape

- Frontend: Vite, React, TypeScript in `src/`.
- E2E tests: `tests/e2e/`.
- OpenSpec specs: `openspec/specs/`.

## Conventions

- Keep default categories configured through `src/categories.ts`, allow browser-side label edits, and maintain exactly nine displayed categories.
- Persist browser-side category labels in localStorage and selected images in IndexedDB.
- Keep selected images and generated media local to the browser.
- Revoke browser object URLs when replacing images or unmounting components.
- Do not add server-side media generation or persistent uploaded-image storage unless a future spec requires it.

## Verification

Run these before considering implementation complete:

```sh
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:e2e
pnpm run build
```

## Deployment Notes

- Target domain: `friendship-collage.nasus.dev`.
- Deploy command: `pnpm run deploy`.
- Deployment requires Cloudflare credentials and zone access.
- PNG and GIF generation run in the browser.
