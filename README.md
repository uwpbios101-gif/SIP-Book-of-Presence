# SIP — The Book of Presence

A complete GitHub Pages package for SIP's luxury digital zero-proof collection. This edition includes the approved public menu presentation for **House Signature No. 01 — Presence**.

## Included

- Hardcover opening and realistic page-turn animation
- Desktop flipbook and smartphone single-page reader
- Search, category navigation, keyboard controls, swipe controls, and full-screen mode
- Optional synthesized page-turn audio
- Print stylesheet for an 8 × 10 inch collector edition
- Offline-capable PWA with local assets and service worker
- Editable menu content in `assets/data/menu.json`
- Reduced-motion and accessible-navigation support

## Upload with GitHub Desktop

1. Extract this ZIP.
2. Open your local repository folder:
   `C:\Users\mkepr\Documents\GitHub\SIP-Book-of-Presence`
3. Copy **all files and folders from this package** into that repository folder.
4. Confirm that `index.html` is directly inside the repository root.
5. Return to GitHub Desktop.
6. Enter the commit summary: `Add Presence house signature website`
7. Click **Commit to main**.
8. Click **Push origin**.

## Activate GitHub Pages

In the online repository, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.

The expected website address is:

`https://uwpbios101-gif.github.io/SIP-Book-of-Presence/`

## Main files

- `index.html` — publication structure and approved Presence page
- `assets/css/styles.css` — visual, responsive, animation, and print system
- `assets/js/app.js` — page turns, search, sound, full screen, mobile reader, and PWA registration
- `assets/data/menu.json` — structured public beverage content
- `service-worker.js` — offline caching
- `manifest.webmanifest` — installable app metadata

## Content status

Presence is the first developed House Signature. Clarity, Legacy, and Renaissance remain marked as in development until their recipes and editorial systems are approved.


## Edition 3.0 corrections

- Direct URL access to `#presence`
- Prominent “Open Presence” buttons on Contents and House Signatures
- Clear visual focus when the Presence page is active
- Versioned CSS/JavaScript files to defeat stale browser caches
- Network-first service worker so new deployments appear promptly
- Automatic removal of previous SIP caches
