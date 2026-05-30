## Context

The repository is currently a Vite React application using the Cloudflare Vite plugin with a starter Worker at `worker/index.ts`. The requested product replaces the starter UI with a complete friendship collage flow: users choose category images locally, edit labels, present them in a guided showcase, and request generated image and GIF outputs from Worker-backed endpoints.

The app should remain lightweight enough to run as a Cloudflare-hosted web app. Static frontend assets should be built by Vite and served by Cloudflare, while `/api/*` routes should be handled by the Worker. Wrangler configuration should target `friendship-collage.nasus.dev`; final deployment will require Cloudflare account, zone, DNS, and authentication access.

GIF generation should use browser-rendered RGBA frames sent to the Worker, with final GIF encoding performed in the Worker by a pure JavaScript encoder. Browser-side labels and selected images should persist in browser storage so users can resume a collage after reloading without uploading images to the server.

## Goals / Non-Goals

**Goals:**

- Replace the starter app with a polished 3 by 3 collage builder for nine configurable, browser-editable categories.
- Let users choose images from their device without requiring accounts or server-side persistent storage.
- Persist edited category labels in localStorage and selected images in IndexedDB.
- Provide an animated showcase mode that alternates between category names and images.
- Generate a combined downloadable collage image through a Worker endpoint.
- Provide a Worker-backed animated GIF generation flow.
- Add Vitest tests for business logic, UI behavior, and Worker handlers.
- Add Playwright tests for primary browser flows, including image selection, showcase navigation, and media-generation actions.
- Add ESLint, Prettier, README, AGENTS guidance, and deployment configuration.

**Non-Goals:**

- User authentication, accounts, or saved galleries.
- Server-side storage of user images beyond the lifetime needed to generate requested outputs.
- Social sharing, collaboration, or public gallery features.
- A category-management admin UI unless needed to satisfy local configuration.
- Guaranteed production deployment without the required Cloudflare account, zone, and DNS access.

## Decisions

- Use the existing Vite React app as the frontend foundation.
  - Rationale: The project already has React, Vite, TypeScript, and Cloudflare plugin wiring.
  - Alternative considered: Rebuild with a meta-framework. That adds routing and deployment complexity that the requested single-page flow does not need.

- Model categories as a typed frontend configuration with the requested defaults and browser-side label edits.
  - Rationale: This satisfies configurability while keeping the initial product simple and deterministic.
  - Alternative considered: Source-code-only configuration. Browser-side editing is now required so users can personalize the collage without code changes.

- Store selected images in browser IndexedDB and send files only when a media output is requested.
  - Rationale: This keeps images private to the browser between sessions until the user explicitly asks for generated media.
  - Alternative considered: Upload immediately after selection. That increases network use and server-side cleanup requirements.

- Implement the generated image as a Worker API endpoint accepting multipart form data and returning a generated image response.
  - Rationale: It matches the requested Worker-generated download and can be covered with Worker tests.
  - Alternative considered: Generate the image entirely in the browser. That would be simpler but would not satisfy the Worker-backed requirement.

- Implement GIF generation as a Worker API endpoint returning direct GIF bytes from browser-rendered RGBA frames.
  - Rationale: Browser canvas can rasterize selected images and antialiased text, while pure JavaScript GIF encoding can run in the Worker and avoid an external renderer.
  - Alternative considered: Generate MP4 media. That requires runtime capabilities outside Cloudflare Workers.

- Keep generated media dimensions fixed for the first implementation.
  - Rationale: Fixed dimensions make visual layout, tests, generated assets, and GIF encoding easier to validate.
  - Alternative considered: User-selectable output sizes. That can be added later after baseline generation works.

- Disable bottom actions until all nine category images are selected.
  - Rationale: This prevents invalid media/showcase flows before they reach Worker validation.
  - Alternative considered: Let users click actions and show errors. Disabled actions provide clearer affordance for the current single-path flow.

- Use Vitest for unit and Worker tests, and Playwright for end-to-end browser flows.
  - Rationale: Vitest fits the Vite/TypeScript stack and Cloudflare has a Vitest Workers pool; Playwright covers real file upload, animations, downloads, and navigation behavior.
  - Alternative considered: Only unit tests. That would miss the most important user journeys.

## Risks / Trade-offs

- IndexedDB has browser quota limits -> Keep selected images local and surface clear errors if persistence fails.
- Large user images can exceed Worker request or memory limits -> Validate file type and size before upload, compress or downscale client-side if needed, and return clear errors from the Worker.
- Multipart image generation can be brittle across browser and Worker runtimes -> Cover request parsing and error cases with Vitest Worker tests.
- Animated showcase tests can be flaky -> Test state transitions and visible content, not exact frame timing.
- Deployment may require credentials not present locally -> Add configuration and documentation, and make deployment a clearly documented final step once access is available.
- Browser-generated object URLs can leak memory -> Revoke replaced and removed image URLs in the frontend lifecycle.

## Migration Plan

- Replace the starter UI and Worker routes with the collage app while preserving the existing Vite/Cloudflare build flow.
- Add dependencies and scripts for Vitest, Playwright, Prettier, and GIF encoding.
- Add Wrangler configuration for static assets, Worker entrypoint, compatibility date, and `friendship-collage.nasus.dev` routing.
- Run typecheck, lint, format check, unit tests, Worker tests, Playwright tests, and production build before deployment.
- Deploy with Wrangler after Cloudflare account and zone access are available.
- Roll back by redeploying the previous Worker version if deployment fails.

## Open Questions

- What Cloudflare account, zone, and API credentials should be used to deploy `friendship-collage.nasus.dev`?
- Should future generated GIFs expose configurable dimensions or frame delay, or is a fixed two-second category pace sufficient for the first release?
