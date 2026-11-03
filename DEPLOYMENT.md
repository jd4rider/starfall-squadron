# Deployment

Starfall Squadron ships the same way as the other Little Joy Arcade originals: GitHub Pages serves
the Vite build under `/play/`, and the arcade catalogue points at it.

## Pipeline

1. `npm test` — combat, mission and save suites.
2. `npm run check:missions` — validates all 300 missions and writes `reports/mission-validation.json`.
3. `npm run build` — `tsc --noEmit` plus the Vite production build.
4. The workflow copies `dist/` into `site/play/`, copies `public/arcade-client.js` beside it, and adds
   a redirecting `site/index.html` so the repository root is not a 404.
5. `actions/deploy-pages` publishes `site/`.

Canonical URL: `https://jd4rider.github.io/starfall-squadron/play/`

The friendlier `https://starfallsquadron.littlejoyarcade.site/play/` is advertised as
`preferredPlayUrl`; the portal probes it and falls back to the github.io build until DNS and the
certificate exist.

## Publishing to the arcade catalogue

The live catalogue is the `games` table in Supabase, not the bundled `src/data/games.ts`. After a push:

```bash
cd ../littlejoyarcade
npx supabase projects api-keys --project-ref fqovramltegcfiyebyrt   # take the service_role key
SUPABASE_SERVICE_ROLE_KEY=... node scripts/publish-game-rest.mjs ../starfall-squadron/arcade-manifest.json
```

The manifest is upserted on the primary key, so re-running is safe. Then confirm the card, the game
page and `/play/starfall-squadron` on the live site.

## What is verified

- All 300 missions are checked for references, ranges, wave schedules, objective arithmetic, boss
  wiring, star order and performance budgets. This is a static check: it proves legality and
  completeness, not human solvability.
- `scripts/smoke.mjs` drives the real production build in a 390x844 viewport: menu, mission start,
  drag input, automatic fire, a power-up, pause, victory and the next mission.
- Physical-device testing has not been performed; mobile results come from desktop Chromium with
  touch emulation.
