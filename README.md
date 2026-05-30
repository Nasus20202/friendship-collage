# Friendship Collage

A static React app for building a nine-category friendship collage. Users select local images, edit category labels, present them in a guided showcase, download a generated collage PNG, and generate an animated GIF locally in the browser.

## Features

- 3 by 3 editable category grid with defaults: animal, place, flower, personality, season, hobby, color, drink, and food.
- Local image selection with previews, replacement support, and browser persistence.
- Animated showcase mode that reveals each category name, then its image.
- Browser-generated PNG collage downloads.
- Browser-generated animated GIF downloads.
- Vitest, Playwright, ESLint, and Prettier setup.

## Setup

Install dependencies:

```sh
pnpm install
```

Run the development server:

```sh
pnpm run dev
```

## Commands

- `pnpm run typecheck`: TypeScript project references.
- `pnpm run lint`: ESLint checks.
- `pnpm run format`: Format files with Prettier.
- `pnpm run format:check`: Check formatting.
- `pnpm run test`: Frontend Vitest tests.
- `pnpm run test:e2e`: Playwright tests.
- `pnpm run build`: Typecheck and production build.
- `pnpm run deploy`: Build and deploy with Wrangler.

## Configuration

Default categories are defined in `src/categories.ts`. Users can rename category labels in the browser before presenting or generating media. Edited labels are stored in localStorage, and selected images are stored in IndexedDB to avoid localStorage quota errors with larger photos.

Media generation stays local to the browser. `Download an image` renders a PNG collage with canvas and downloads `friendship-collage.png`. `Generate a GIF` renders canvas frames and encodes `friendship-collage.gif` with `gifenc`.

## GIF Generation

GIF generation uses the pure JavaScript `gifenc` encoder in the browser. No selected images or generated media are uploaded to a server.

## Deployment

The app builds as static Vite assets and can be deployed to Cloudflare Pages or any static host.

Deploy after Cloudflare account, zone, DNS, and API credentials are available:

```sh
pnpm run deploy
```

If deployment fails, inspect Wrangler output and redeploy the previous static build from Cloudflare if rollback is needed.
