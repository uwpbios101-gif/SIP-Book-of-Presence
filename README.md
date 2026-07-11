# SIP — The Book of Presence

A six-page working prototype for SIP's luxury digital zero-proof collection.

## Included

- Hardcover opening and realistic page-turn animation
- Desktop flipbook and mobile single-page reader
- Search, chapter navigation, keyboard controls, swipe controls, and full-screen mode
- Optional synthesized page-turn audio
- Print stylesheet for an 8 × 10 inch collector edition
- Offline-capable PWA with local assets and service worker
- Editable prototype content in `assets/data/menu.json`
- Progressive enhancement: readable content remains available when advanced effects are unavailable

## Prototype content notice

The visible beverage composition, tasting direction, pairing direction, and collection counts are conceptual placeholders. Replace them only after recipe, naming, and pricing approval.

## Publish with GitHub Pages

1. Open the `SIP-Book-of-Presence` repository.
2. Choose **Add file → Upload files**.
3. Upload the *contents* of this folder so `index.html` is at the repository root.
4. Commit to the `main` branch.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select `main` and `/ (root)`, then save.

The project URL will normally be:

`https://uwpbios101-gif.github.io/SIP-Book-of-Presence/`

## Main files

- `index.html` — semantic publication structure
- `assets/css/styles.css` — complete visual, responsive, animation, and print system
- `assets/js/app.js` — page turning, search, sound, full screen, mobile reader, and PWA registration
- `assets/data/menu.json` — editable content source for the next phase
- `service-worker.js` — offline caching
- `manifest.webmanifest` — installable app metadata

## Next production gate

Approve the visual prototype, then replace concept content with approved recipes and commission the three campaign-test photographs: Presence, Clarity, and Renaissance.
