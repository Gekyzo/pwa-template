# Changelog

Technical changes, newest first. What a user sees of a version goes to `release-notes/`, in each language of the app.

## Unreleased

No change.

## 0.1.2 - 2026-10-24

- Release notes: `release-notes/<lang>.md`, one file per catalog, released with the version by `npm run release`, which stops when the languages disagree. The app shows the unseen versions in a What's new sheet after an update (`nextSeen`, seen version in storage) and every version from Settings › Help. This file is now the technical record.

## 0.1.1 - 2026-10-24

- The message that shows after an action, with its undo, is a raised card in the colours of the screen. It is no longer a black box in light and a white box in dark.
- The icon of Settings is a gear, as in the other apps of the family.
- The new look of the family of apps: the Geist font, a stone ground, square corners and green
  for the main action. From 600px the rail stands at the side of the hand.
- The note sheet has a head with **Close** and keeps **Save** at the bottom. A drag down of its
  head closes it. An empty list of notes offers **Add note**.
- Settings groups its choices into rows: **Backup**, **Preferences** (language, hand and theme,
  each with its current value), **Modules**, **App** and **Help**. **App** shows only when the
  install is offered.
