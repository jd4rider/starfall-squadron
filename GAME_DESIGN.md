# Starfall Squadron — design notes

## Core loop

Drag to fly, guns fire automatically, collect capsules, clear the objective, bank credits, upgrade the
hangar, fly the next mission. The auto-fire decision is deliberate: one thumb should be enough for the
whole game, and aiming is expressed through positioning rather than a second input.

## Simulation

- Fixed 1/60s steps with an accumulator capped at six catch-up steps.
- Pure state (`CombatSim`) with no Three.js imports; the renderer reads entity arrays.
- Seeded randomness (`mulberry32`) keyed by mission id and seed, so drops and spawns repeat.
- Player fire is swept by distance checks against circle radii, with piercing and splash resolved
  explicitly rather than through mesh intersections.

## Damage and defence

Shields absorb before hull. Hull damage grants a short invulnerability window, and a lost hull costs
one of three lives (or ends the run in one-life modes). Crit chance is 6% baseline, 45% with a crit
buff; crits double damage. Enemy shields cut incoming damage by 55%.

## Bosses

Bosses spawn after the escort waves, enter the lane over about two seconds, then sweep side to side.
Turrets orbit the hull and fire aimed shots; while any turret lives, hull damage is reduced to 35%.
Turrets fall away as the hull weakens, so the fight naturally moves from "kill the guns" to "hit the
core". Every phase clears hostile fire once, which is a fairness beat rather than a reward.

## Weapons

Ten families, five levels each. Damage grows ~27% per level, cooldown shrinks ~7.5%, and shot count
grows on the multi-shot families. The railgun trades rate for penetration; the particle cannon trades
damage for volume; fusion and wave trade speed for area.

## Power-ups

Forty effects across four rarities. Hard rules:

- Weapon level caps at 5, drones at 3, lives at 5, bombs accumulate without a cap but are consumed.
- Timed effects refresh to the longer remaining duration; they never stack multiplicatively.
- Mega Shield raises max shields for its duration and is reverted by cleanup, so it cannot be
  permanent.
- Missile Barrage is a two-second charge of automatic missiles, not a permanent buff.

## Level generation

Mission `index` seeds everything. The first fifteen missions are curated tutorials (one idea each),
sector finales are flagship fights, and the rest are built from a threat budget: each wave spends
threat on 1-3 archetypes drawn from the sector roster. Difficulty rises with the sector and with
position inside it.

Validation is static: legal references, spawn bounds, wave order, objective reachability within the
roster, boss/sector wiring, star thresholds and performance caps. It cannot prove a human can win,
and the code does not claim it does.

## Accessibility

Reduced motion removes shake, high-contrast mode thickens projectile glow, quality presets reduce
particles and star counts, and controls support absolute or relative dragging plus keyboard.
