# WingOver contributor notes

## Working agreement

- Use the existing red, black, and cream WingOver visual language.
- Keep the landing page at `/` and the full menu at `/menu`.
- Keep menu content in `lib/menu-data.ts`; do not duplicate menu arrays inside page components.
- Use paths beginning with `/images/` or `/videos/` for files in `public/`.
- Preserve responsive behavior and the `prefers-reduced-motion` rule when changing animations.
- Run `pnpm build` after meaningful layout or TypeScript changes.

## Content model

`MenuItem` already supports `ingredients` and `video` fields. Add those fields to the shared data before building the ingredient or video UI so both routes stay in sync.

## Visual checks

Check both `/` and `/menu` after changes. Test the menu tabs, sauce circles, mobile layout, and links between the two routes.
