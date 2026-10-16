# PWA Template

A template for offline Android PWAs. Plain HTML, CSS and ES modules: no build step and no
dependencies. It gives a new app:

- an offline service worker, an update check with an update toast, and an install button;
- an adaptive layout: a bottom bar on a phone, a rail on a tablet, list and detail side by side
  on a wide screen;
- a design system with a live catalogue at `/designs/`;
- English and Spanish text, light and dark themes, a left-hand mode;
- a release script and a GitHub Pages deploy on a version tag;
- structural tests that keep the layers, the text, the design system and the specification in step.

A small notes list shows each part in use. Replace it with the domain of the app.

## Start a new app

1. Copy the repository without its history: `cp -r pwa-template my-app && rm -rf my-app/.git`.
2. `cd my-app && npm run init -- my-app "My App" [--short "App"] [--theme "#1f7a4d"]`.
3. `git init -b main && npm run hooks`.
4. Replace `icons/source.png` (512×512, art inside the centre 80%), then `npm run icons`.
5. Replace or delete the notes demo. `docs/spec/07-notes.md` lists its files.
6. `npm test`.

## Develop

```sh
npm run serve   # http://localhost:8080
npm test
npm run ds      # copy the design system again from ../pwa-design-system
```

## Install on Android

Open the deployed URL in Chrome. Use the **Install** button of Settings, or Chrome menu →
**Install app**.

## Release and deploy

1. Write the user-visible changes under `## Unreleased` in `CHANGELOG.md`.
2. `npm run release` (or `npm run release -- minor|major`). It commits `Bump version to X.Y.Z`
   and creates the tag `vX.Y.Z`.
3. `git push --follow-tags`. The workflow `.github/workflows/pages.yml` deploys the tag.

Set the repository's Pages source to "GitHub Actions" once.

## Design system

The shared tokens, components and layouts come from `pwa-design-system`, copied into
`vendor/design-system/` by `npm run ds`; `SOURCE.json` there names the version and the commit.
`index.html` loads `vendor/design-system/design-system.css`, then `styles.css`, which holds the
parts of the app only. Change a shared part in `pwa-design-system`, then run `npm run ds`; never
edit `vendor/` by hand. Open `/designs/` on the dev server for the catalogue.
`docs/spec/04-design-system.md` has the rules of the app and points to the shared ones.
