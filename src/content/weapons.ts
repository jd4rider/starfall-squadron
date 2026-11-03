/** Primary weapons: ten families, five upgrade levels each. */

export type WeaponKind = 'pulse' | 'spread' | 'beam' | 'ion' | 'photon' | 'rail' | 'arc' | 'particle' | 'fusion' | 'wave'

export interface WeaponLevel {
  damage: number
  cooldown: number
  shots: number
  spread: number
  speed: number
  radius: number
  pierce: number
}

export interface WeaponSpec {
  id: string
  name: string
  kind: WeaponKind
  blurb: string
  color: string
  special?: 'chain' | 'aoe' | 'wave'
  levels: WeaponLevel[]
}

interface RampInput {
  damage: number
  cooldown: number
  shots: number
  shotGrowth: number
  spread: number
  spreadGrowth: number
  speed: number
  radius: number
  pierce?: number
}

/** Five upgrade steps with damage/rate growth and a shot-count progression. */
function ramp(input: RampInput): WeaponLevel[] {
  return [0, 1, 2, 3, 4].map((step) => ({
    damage: Number((input.damage * (1 + step * 0.27)).toFixed(2)),
    cooldown: Number((input.cooldown * (1 - step * 0.075)).toFixed(3)),
    shots: input.shots + Math.floor(step * input.shotGrowth),
    spread: Number((input.spread + step * input.spreadGrowth).toFixed(1)),
    speed: Number((input.speed * (1 + step * 0.04)).toFixed(1)),
    radius: Number((input.radius * (1 + step * 0.05)).toFixed(2)),
    pierce: (input.pierce ?? 0) + (step >= 3 ? 1 : 0),
  }))
}

export const WEAPONS: WeaponSpec[] = [
  {
    id: 'pulse',
    name: 'Pulse Cannon',
    kind: 'pulse',
    blurb: 'The reliable one. Single bolts that grow into a three-stream volley.',
    color: '#4de1ff',
    levels: ramp({ damage: 3.4, cooldown: 0.115, shots: 1, shotGrowth: 0.6, spread: 0, spreadGrowth: 1.4, speed: 150, radius: 0.9 }),
  },
  {
    id: 'spread',
    name: 'Plasma Spread',
    kind: 'spread',
    blurb: 'A widening fan of superheated gas. Excellent against formations.',
    color: '#c084fc',
    levels: ramp({ damage: 2.7, cooldown: 0.26, shots: 3, shotGrowth: 0.8, spread: 20, spreadGrowth: 5, speed: 128, radius: 1.05 }),
  },
  {
    id: 'beam',
    name: 'Laser Beam',
    kind: 'beam',
    blurb: 'A tightly focused line of light with almost no gap between pulses.',
    color: '#a5f3fc',
    levels: ramp({ damage: 1.55, cooldown: 0.05, shots: 1, shotGrowth: 0.3, spread: 0, spreadGrowth: 0.6, speed: 220, radius: 0.62 }),
  },
  {
    id: 'ion',
    name: 'Ion Cannon',
    kind: 'ion',
    blurb: 'Heavy charged rounds that punch straight through the first hull.',
    color: '#67e8f9',
    levels: ramp({ damage: 7.6, cooldown: 0.27, shots: 1, shotGrowth: 0.4, spread: 0, spreadGrowth: 1.2, speed: 145, radius: 1.15, pierce: 2 }),
  },
  {
    id: 'photon',
    name: 'Photon Blaster',
    kind: 'photon',
    blurb: 'Fast, bright and forgiving. Trades punch for volume.',
    color: '#fde68a',
    levels: ramp({ damage: 4.1, cooldown: 0.09, shots: 1, shotGrowth: 0.5, spread: 0, spreadGrowth: 1.6, speed: 195, radius: 0.85 }),
  },
  {
    id: 'rail',
    name: 'Railgun',
    kind: 'rail',
    blurb: 'One shot, one line. Slow to cycle and worth every second.',
    color: '#f8fafc',
    levels: ramp({ damage: 17, cooldown: 0.62, shots: 1, shotGrowth: 0.35, spread: 0, spreadGrowth: 1.0, speed: 265, radius: 1.25, pierce: 4 }),
  },
  {
    id: 'arc',
    name: 'Arc Lightning',
    kind: 'arc',
    special: 'chain',
    blurb: 'Each hit forks into the nearest ship. Designed for crowded lanes.',
    color: '#c4b5fd',
    levels: ramp({ damage: 5.1, cooldown: 0.23, shots: 1, shotGrowth: 0.4, spread: 0, spreadGrowth: 1.4, speed: 175, radius: 1.05 }),
  },
  {
    id: 'particle',
    name: 'Particle Cannon',
    kind: 'particle',
    blurb: 'A stream of tiny rounds. Weak alone, relentless together.',
    color: '#8ef0c8',
    levels: ramp({ damage: 1.1, cooldown: 0.038, shots: 1, shotGrowth: 0.5, spread: 0, spreadGrowth: 1.2, speed: 205, radius: 0.5 }),
  },
  {
    id: 'fusion',
    name: 'Fusion Blaster',
    kind: 'fusion',
    special: 'aoe',
    blurb: 'Slow orbs that detonate and take the neighbours with them.',
    color: '#fb923c',
    levels: ramp({ damage: 9.2, cooldown: 0.4, shots: 1, shotGrowth: 0.4, spread: 0, spreadGrowth: 1.5, speed: 118, radius: 1.65 }),
  },
  {
    id: 'wave',
    name: 'Wave Cannon',
    kind: 'wave',
    special: 'wave',
    blurb: 'Expanding crescents that sweep entire rows out of the sky.',
    color: '#f472b6',
    levels: ramp({ damage: 6.3, cooldown: 0.36, shots: 1, shotGrowth: 0.35, spread: 0, spreadGrowth: 0.8, speed: 100, radius: 2.15, pierce: 2 }),
  },
]

export const WEAPON_BY_ID = new Map(WEAPONS.map((weapon) => [weapon.id, weapon]))

export function weaponById(id: string): WeaponSpec {
  return WEAPON_BY_ID.get(id) ?? (WEAPONS[0] as WeaponSpec)
}

export function weaponLevel(spec: WeaponSpec, level: number): WeaponLevel {
  const index = Math.max(0, Math.min(4, Math.round(level) - 1))
  return spec.levels[index] as WeaponLevel
}

/** Secondary weapons are limited-use, so they read as emergencies. */
export interface SecondarySpec {
  id: string
  name: string
  blurb: string
  charges: number
  cooldown: number
  damage: number
  radius: number
  color: string
}

export const SECONDARIES: SecondarySpec[] = [
  { id: 'missiles', name: 'Homing Missiles', blurb: 'Two seekers that never miss.', charges: 4, cooldown: 0.7, damage: 14, radius: 9, color: '#fdba74' },
  { id: 'torpedo', name: 'Torpedo Salvo', blurb: 'A heavy spread of dumb rockets.', charges: 3, cooldown: 1.1, damage: 22, radius: 12, color: '#fca5a5' },
  { id: 'emp', name: 'EMP Burst', blurb: 'Stuns everything on screen.', charges: 2, cooldown: 1.4, damage: 9, radius: 60, color: '#a5f3fc' },
  { id: 'mine', name: 'Plasma Mines', blurb: 'Drops a field of waiting explosions.', charges: 3, cooldown: 1.0, damage: 18, radius: 14, color: '#fcd34d' },
  { id: 'orbital', name: 'Orbital Strike', blurb: 'Calls down a column of fire.', charges: 2, cooldown: 1.6, damage: 30, radius: 20, color: '#f0abfc' },
]

export const SECONDARY_BY_ID = new Map(SECONDARIES.map((entry) => [entry.id, entry]))

export function secondaryById(id: string): SecondarySpec {
  return SECONDARY_BY_ID.get(id) ?? (SECONDARIES[0] as SecondarySpec)
}
