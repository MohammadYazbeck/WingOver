# WingOver assets

## Website assets

- `public/images/wingover-logo.png` is the transparent logo used by the header and footer.
- `public/images/` contains the featured meal images used by the landing and menu pages.
- `public/images/bring-the-heat-motion-1024.gif` and `public/images/crispy-chicken-feast.png` are the paired visuals in the landing page's Bring the Heat section.
- `public/images/heat-motion-still-1024.png` is the final artwork frame shown in that section when reduced motion is preferred.
- `public/images/sauces/` contains the circular sauce photos.
- `public/videos/` is reserved for short, silent hero and meal clips.

## Naming convention

Use lowercase kebab-case names:

```text
hero-food.mp4
wings-toss.mp4
nashville-sandwich.mp4
loaded-fries.mp4
hero-food-poster.jpg
```

When a new file is added, update the matching object in `lib/menu-data.ts` rather than hard-coding the path in a page component.
