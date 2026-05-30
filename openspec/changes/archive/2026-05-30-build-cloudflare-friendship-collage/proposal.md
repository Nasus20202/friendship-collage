## Why

The project needs a complete Cloudflare-hosted app for creating and presenting a personal friendship collage from user-selected category images. This turns a static idea into an interactive experience with browser-side image selection, shareable presentation flow, generated media outputs, and testable deployment behavior.

## What Changes

- Build a Cloudflare app deployed to `friendship-collage.nasus.dev`.
- Show a configurable 3 by 3 category grid on first load, with defaults: animal, place, flower, personality, season, hobby, color, drink, and food.
- Let users select an image from their device for each category.
- Add bottom actions for presenting the collage, downloading a generated combined image, and generating a GIF.
- Add showcase mode that walks through each category name and selected image with animated transitions and next-step controls.
- Add a Worker-backed combined image generation flow.
- Add a Worker-backed animated GIF generation flow.
- Add Vitest and Playwright coverage for the main user flows and worker behavior.
- Add ESLint and Prettier configuration for consistent code quality.
- Add project documentation in `README.md` and contributor guidance in `AGENTS.md`.
- Include deployment configuration for the target Cloudflare domain.

## Capabilities

### New Capabilities

- `collage-categories`: Configurable category grid and image selection behavior.
- `collage-showcase`: Presentation mode that reveals category names and images with animated transitions.
- `media-generation`: Worker-backed generated image download and animated GIF generation.
- `quality-and-deployment`: Testing, linting, formatting, documentation, and Cloudflare deployment requirements.

### Modified Capabilities

None.

## Impact

- Frontend application structure, styling, state management, and user interactions.
- Cloudflare Worker routes or functions for media generation.
- GIF encoding integration and browser storage persistence.
- Test infrastructure for Vitest and Playwright.
- Tooling configuration for ESLint, Prettier, and deployment.
- Documentation files and deployment instructions for `friendship-collage.nasus.dev`.
