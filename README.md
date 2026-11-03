# Starfall Squadron

A portrait-first 3D arcade space shooter for [Little Joy Arcade](https://littlejoyarcade.site).

Fly ten fighters, break ten capital ships, and hold the last sky across 300 missions in ten sectors.

## What is in the box

- **300 missions / 10 sectors**, generated from stable seeds and statically validated in CI
- **10 capital-ship bosses**, each with three phases, destructible turrets and telegraphed patterns
- **10 flyable ships** with distinct hull, shield, speed, damage and signature abilities
- **10 primary weapons** (five upgrade levels each) plus five secondary weapons
- **40 power-ups** with explicit caps and stacking rules
- **10 enemy archetypes behaviours across 25 ships and 6 factions**, with formations
- **Modes**: campaign, endless survival, boss rush, daily challenge, arcade classic, zen patrol, 10 challenge rulesets
- **Hangar** with credits, ship unlocks, weapon upgrades and trail cosmetics
- **Local saves** (versioned, migrated, never silently wiped) and 16 achievements

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # combat, mission and save tests
npm run check:missions
npm run build
npm run smoke      # browser smoke test, needs a served build
```

## Architecture

Gameplay lives in pure TypeScript (`src/sim/combat.ts`) on a fixed 1/60s step with seeded randomness.
Three.js only reads that state: `src/render/scene.ts` builds procedural ships, bosses, starfields and
particles and never writes gameplay values. `src/levels/generate.ts` seeds every mission from its index,
so the validation script and the game agree on every wave.

See `DEPLOYMENT.md` for the Pages pipeline and `GAME_DESIGN.md` for mechanics and balance notes.
