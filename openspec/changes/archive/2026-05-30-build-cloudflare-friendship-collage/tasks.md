## 1. Project Setup

- [x] 1.1 Audit the existing Vite React and Cloudflare Worker starter files to identify starter code to replace.
- [x] 1.2 Add required dependencies for Vitest, Cloudflare Worker testing, Playwright, Prettier, GIF encoding, and media generation.
- [x] 1.3 Add or update npm scripts for typecheck, lint, format, format check, unit tests, Worker tests, Playwright tests, build, preview, and deploy.
- [x] 1.4 Configure Prettier and update ESLint coverage for app, Worker, test, and config files.
- [x] 1.5 Add Cloudflare deployment configuration for Vite static assets, `worker/index.ts`, compatibility date, and `friendship-collage.nasus.dev`.

## 2. Category Builder

- [x] 2.1 Create typed category configuration with the default nine categories: animal, place, flower, personality, season, hobby, color, drink, and food.
- [x] 2.2 Implement validation that falls back to defaults when category configuration does not contain exactly nine names.
- [x] 2.3 Replace the starter React UI with the collage builder layout and responsive 3 by 3 category grid.
- [x] 2.4 Add image file inputs for every category with accepted image type validation.
- [x] 2.5 Add selected-image previews, replacement behavior, missing-image state, and object URL cleanup.
- [x] 2.6 Add bottom actions for presenting the collage, downloading an image, and generating a GIF.
- [x] 2.7 Add accessible labels, focus states, and mobile behavior for the builder controls.

## 3. Showcase Mode

- [x] 3.1 Implement showcase state that alternates category-name and category-image steps in configured category order.
- [x] 3.2 Add present action behavior that enters showcase mode at the first category name.
- [x] 3.3 Add next navigation that advances from name to image and from image to the next category.
- [x] 3.4 Add final-step looping or restart behavior after the ninth category image.
- [x] 3.5 Add an exit control that returns to the builder without losing selected images.
- [x] 3.6 Add polished transitions between showcase steps with reduced-motion support.

## 4. Worker Image Generation

- [x] 4.1 Replace the starter Worker API response with routed handlers for generated media endpoints.
- [x] 4.2 Implement multipart parsing and validation for category names and exactly nine accepted image files.
- [x] 4.3 Implement generated collage image composition with all category labels and selected images.
- [x] 4.4 Return the generated image with a correct image content type and download filename headers.
- [x] 4.5 Add clear Worker error responses for missing files, invalid file types, oversized payloads, and generation failures.
- [x] 4.6 Wire the frontend download image action to upload selected files, handle errors, and trigger browser download.

## 5. Worker-Backed GIF Generation

- [x] 5.1 Create Worker GIF generation for the category sequence.
- [x] 5.2 Define the Worker GIF-generation API contract for direct GIF output.
- [x] 5.3 Remove external renderer configuration.
- [x] 5.4 Implement Worker-side GIF encoding while keeping the Worker as the public API boundary.
- [x] 5.5 Return completed GIF responses with correct content type and filename headers.
- [x] 5.6 Wire the frontend generate GIF action to upload selected files, show progress, handle failures, and provide the completed download.
- [x] 5.7 Document Worker-backed GIF generation.

## 6. Tests

- [x] 6.1 Add Vitest tests for category configuration defaults, invalid configuration fallback, image validation, and missing-image validation.
- [x] 6.2 Add Vitest tests for showcase step progression, looping or restart behavior, and exit behavior.
- [x] 6.3 Add Cloudflare Worker Vitest tests for generated image success and validation failure cases.
- [x] 6.4 Add Worker tests for GIF-generation API success and failure responses.
- [x] 6.5 Add Playwright configuration with a local web server and test fixtures for image uploads.
- [x] 6.6 Add Playwright tests for default category rendering, selecting all category images, previews, and bottom actions.
- [x] 6.7 Add Playwright tests for showcase navigation, animated step changes by visible state, reduced-motion behavior, and exit.
- [x] 6.8 Add Playwright tests for generated image download and GIF generation request flow using controlled fixtures.

## 7. Documentation and Verification

- [x] 7.1 Create `README.md` with setup, development, testing, media generation, deployment, and troubleshooting instructions.
- [x] 7.2 Create `AGENTS.md` with project conventions, verification commands, and implementation constraints.
- [x] 7.3 Run format check and fix formatting issues.
- [x] 7.4 Run ESLint and fix lint issues.
- [x] 7.5 Run TypeScript typecheck and fix type errors.
- [x] 7.6 Run Vitest unit and Worker tests and fix failures.
- [x] 7.7 Run Playwright tests and fix failures.
- [x] 7.8 Run the production build and fix build failures.
- [ ] 7.9 Deploy to `friendship-collage.nasus.dev` after Cloudflare credentials, zone access, and DNS configuration are available.
- [ ] 7.10 Commit the completed implementation changes after verification passes.
