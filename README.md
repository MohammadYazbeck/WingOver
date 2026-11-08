# WingOver

WingOver is a small Next.js restaurant template with a branded landing page and a dedicated menu page. The current design uses the WingOver red, black, and cream palette, circular sauce cards, responsive layouts, and scroll animations.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
pnpm build
pnpm start
pnpm check
```

`pnpm check` runs the TypeScript check without opening an interactive setup prompt. The current `lint` script is kept for later ESLint configuration.

## Project map

```text
app/
  page.tsx          Landing page
  menu/page.tsx     Full menu page with category tabs
  api/game/         Signed game sessions, claims, and redemption
  globals.css       Shared brand styles and responsive layout
lib/
  menu-data.ts      Shared menu, sauce, and category content
  game-rewards.ts   Shared prize thresholds
public/
  images/           Food, sauce, and logo assets
  videos/           Reserved for hero and meal videos
docs/
  ASSETS.md         Asset naming and replacement guide
```

## Where to edit content

Menu names, descriptions, prices, image paths, categories, and sauce lists live in [`lib/menu-data.ts`](lib/menu-data.ts). Add future meal ingredients and video paths to the `MenuItem` fields there so the homepage and menu page can share the same content.

The page layout and interactions live in [`app/page.tsx`](app/page.tsx) and [`app/menu/page.tsx`](app/menu/page.tsx). Shared styling belongs in [`app/globals.css`](app/globals.css).

## Adding media

Place production-ready images in `public/images/` and short silent MP4/WebM clips in `public/videos/`. Reference them with public paths such as `/images/wings-red.jpg` or `/videos/hero-food.mp4`.

The source photo collection and brand PDFs are kept in the project root for reference while this template is being prepared.
