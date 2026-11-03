/** Ten capital-ship bosses, each with three meaningful phases. */

export type BossPattern = 'radial' | 'aimed' | 'sweep' | 'spiral' | 'minions' | 'mines' | 'burst' | 'laser'

export interface BossPhase {
  /** Fraction of max hull at which this phase begins. */
  at: number
  name: string
  patterns: BossPattern[]
  fireCooldown: number
  bulletSpeed: number
  note: string
}

export interface BossSpec {
  id: string
  sector: number
  name: string
  subtitle: string
  blurb: string
  hp: number
  turrets: number
  turretHp: number
  radius: number
  x: number
  color: string
  accent: string
  shape: 'dreadnought' | 'serpent' | 'crystal' | 'carrier' | 'leviathan' | 'volt' | 'harbinger' | 'ark' | 'fortress' | 'devourer'
  phases: BossPhase[]
  reward: number
}

export const BOSSES: BossSpec[] = [
  {
    id: 'dreadnought',
    sector: 1,
    name: 'The Dreadnought',
    subtitle: 'Alien battleship',
    blurb: 'A blunt instrument: four turrets, then the hull, then the core.',
    hp: 900,
    turrets: 4,
    turretHp: 90,
    radius: 14,
    x: 0,
    color: '#3f3f46',
    accent: '#ff7a59',
    shape: 'dreadnought',
    phases: [
      { at: 1, name: 'Turret Screen', patterns: ['aimed'], fireCooldown: 1.5, bulletSpeed: 46, note: 'Turrets fire aimed volleys.' },
      { at: 0.66, name: 'Broadside', patterns: ['aimed', 'radial'], fireCooldown: 1.2, bulletSpeed: 52, note: 'Radial bursts join the aimed fire.' },
      { at: 0.33, name: 'Exposed Core', patterns: ['radial', 'burst'], fireCooldown: 0.95, bulletSpeed: 58, note: 'The core is open. Everything fires.' },
    ],
    reward: 600,
  },
  {
    id: 'serpent',
    sector: 2,
    name: 'The Crimson Serpent',
    subtitle: 'Segmented warship',
    blurb: 'It coils across the lane, so the safe spot keeps moving.',
    hp: 1150,
    turrets: 5,
    turretHp: 105,
    radius: 15,
    x: 0,
    color: '#7f1d1d',
    accent: '#ff8a5c',
    shape: 'serpent',
    phases: [
      { at: 1, name: 'Coil', patterns: ['sweep'], fireCooldown: 1.4, bulletSpeed: 50, note: 'Sweeping fire follows the coil.' },
      { at: 0.66, name: 'Strike', patterns: ['sweep', 'aimed'], fireCooldown: 1.1, bulletSpeed: 56, note: 'It lunges and fires together.' },
      { at: 0.33, name: 'Frenzy', patterns: ['spiral', 'radial'], fireCooldown: 0.85, bulletSpeed: 62, note: 'A spiral of plasma and no gaps.' },
    ],
    reward: 750,
  },
  {
    id: 'empress',
    sector: 3,
    name: 'The Crystal Empress',
    subtitle: 'Crystalline capital ship',
    blurb: 'Rotating shield prisms make half your shots glance off.',
    hp: 1450,
    turrets: 6,
    turretHp: 115,
    radius: 15,
    x: 0,
    color: '#155e75',
    accent: '#67e8f9',
    shape: 'crystal',
    phases: [
      { at: 1, name: 'Prism Guard', patterns: ['radial'], fireCooldown: 1.5, bulletSpeed: 50, note: 'Radial shards from every facet.' },
      { at: 0.66, name: 'Refraction', patterns: ['spiral', 'aimed'], fireCooldown: 1.15, bulletSpeed: 58, note: 'Spirals that bend inward.' },
      { at: 0.33, name: 'Shatter', patterns: ['burst', 'laser'], fireCooldown: 0.9, bulletSpeed: 64, note: 'Laser sweeps between bursts.' },
    ],
    reward: 900,
  },
  {
    id: 'inferno',
    sector: 4,
    name: 'The Inferno Carrier',
    subtitle: 'Fire-line carrier',
    blurb: 'Launches bombers and lays burning mines behind them.',
    hp: 1750,
    turrets: 5,
    turretHp: 130,
    radius: 16,
    x: 0,
    color: '#7c2d12',
    accent: '#fb923c',
    shape: 'carrier',
    phases: [
      { at: 1, name: 'Launch Bay', patterns: ['minions', 'aimed'], fireCooldown: 1.6, bulletSpeed: 48, note: 'Bombers launch from the bay.' },
      { at: 0.66, name: 'Fire Line', patterns: ['laser', 'mines'], fireCooldown: 1.2, bulletSpeed: 54, note: 'Laser lines and mine drops.' },
      { at: 0.33, name: 'Meltdown', patterns: ['burst', 'radial', 'minions'], fireCooldown: 0.8, bulletSpeed: 60, note: 'The reactor vents everything.' },
    ],
    reward: 1050,
  },
  {
    id: 'leviathan',
    sector: 5,
    name: 'The Frost Leviathan',
    subtitle: 'Ice-bound leviathan',
    blurb: 'Freezing fields slow your ship and your shots.',
    hp: 2050,
    turrets: 6,
    turretHp: 140,
    radius: 17,
    x: 0,
    color: '#1e3a5f',
    accent: '#93c5fd',
    shape: 'leviathan',
    phases: [
      { at: 1, name: 'Rime', patterns: ['aimed', 'sweep'], fireCooldown: 1.5, bulletSpeed: 46, note: 'Slow, heavy aimed fire.' },
      { at: 0.66, name: 'Deep Freeze', patterns: ['radial', 'laser'], fireCooldown: 1.15, bulletSpeed: 52, note: 'Laser columns across the lane.' },
      { at: 0.33, name: 'Glacier Break', patterns: ['spiral', 'burst'], fireCooldown: 0.85, bulletSpeed: 58, note: 'Ice shards spiral outward.' },
    ],
    reward: 1200,
  },
  {
    id: 'sovereign',
    sector: 6,
    name: 'The Volt Sovereign',
    subtitle: 'Storm battleship',
    blurb: 'Chains lightning through your drones and your hull alike.',
    hp: 2400,
    turrets: 6,
    turretHp: 150,
    radius: 17,
    x: 0,
    color: '#4c1d95',
    accent: '#c4b5fd',
    shape: 'volt',
    phases: [
      { at: 1, name: 'Charge', patterns: ['aimed', 'burst'], fireCooldown: 1.35, bulletSpeed: 56, note: 'Short, sharp bursts.' },
      { at: 0.66, name: 'Arc Web', patterns: ['spiral', 'radial'], fireCooldown: 1.05, bulletSpeed: 62, note: 'A web of slow arcs.' },
      { at: 0.33, name: 'Overload', patterns: ['laser', 'burst', 'mines'], fireCooldown: 0.75, bulletSpeed: 68, note: 'Overloaded emitters, no safe lane.' },
    ],
    reward: 1400,
  },
  {
    id: 'harbinger',
    sector: 7,
    name: 'The Gravity Harbinger',
    subtitle: 'Rift manipulator',
    blurb: 'Pulls your ship toward the hull and bends every projectile.',
    hp: 2750,
    turrets: 5,
    turretHp: 160,
    radius: 18,
    x: 0,
    color: '#4c1d95',
    accent: '#e879f9',
    shape: 'harbinger',
    phases: [
      { at: 1, name: 'Pull', patterns: ['radial'], fireCooldown: 1.4, bulletSpeed: 50, note: 'Gravity drags you forward.' },
      { at: 0.66, name: 'Fold', patterns: ['spiral', 'aimed'], fireCooldown: 1.05, bulletSpeed: 58, note: 'Shots curve around the rift.' },
      { at: 0.33, name: 'Collapse', patterns: ['burst', 'radial', 'laser'], fireCooldown: 0.78, bulletSpeed: 64, note: 'The rift starts collapsing.' },
    ],
    reward: 1600,
  },
  {
    id: 'ark',
    sector: 8,
    name: 'The Phantom Ark',
    subtitle: 'Stealth mothership',
    blurb: 'Teleports, leaves decoys, and fires from wherever you are not looking.',
    hp: 3100,
    turrets: 6,
    turretHp: 170,
    radius: 18,
    x: 0,
    color: '#831843',
    accent: '#f9a8d4',
    shape: 'ark',
    phases: [
      { at: 1, name: 'Decoys', patterns: ['minions', 'aimed'], fireCooldown: 1.4, bulletSpeed: 54, note: 'Decoy fighters screen the hull.' },
      { at: 0.66, name: 'Blink', patterns: ['aimed', 'mines'], fireCooldown: 1.0, bulletSpeed: 62, note: 'It disappears and reappears.' },
      { at: 0.33, name: 'Unmasked', patterns: ['spiral', 'burst', 'laser'], fireCooldown: 0.72, bulletSpeed: 70, note: 'No more hiding.' },
    ],
    reward: 1850,
  },
  {
    id: 'behemoth',
    sector: 9,
    name: 'The Iron Behemoth',
    subtitle: 'Mechanical fortress',
    blurb: 'Heavy plating absorbs damage until every turret is gone.',
    hp: 3600,
    turrets: 8,
    turretHp: 190,
    radius: 19,
    x: 0,
    color: '#292524',
    accent: '#fbbf24',
    shape: 'fortress',
    phases: [
      { at: 1, name: 'Plating', patterns: ['aimed', 'radial'], fireCooldown: 1.5, bulletSpeed: 54, note: 'Armour shrugs off 65% of damage.' },
      { at: 0.66, name: 'Siege', patterns: ['laser', 'mines'], fireCooldown: 1.15, bulletSpeed: 60, note: 'Siege lasers sweep the lane.' },
      { at: 0.33, name: 'Breach', patterns: ['burst', 'spiral'], fireCooldown: 0.8, bulletSpeed: 68, note: 'The armour is open. Hit the core.' },
    ],
    reward: 2100,
  },
  {
    id: 'devourer',
    sector: 10,
    name: 'The Starfall Devourer',
    subtitle: 'Alien mothership',
    blurb: 'Everything the fleet has, all at once, with a core that fights back.',
    hp: 5200,
    turrets: 10,
    turretHp: 220,
    radius: 21,
    x: 0,
    color: '#0f172a',
    accent: '#7dd3fc',
    shape: 'devourer',
    phases: [
      { at: 1, name: 'Hive Screen', patterns: ['minions', 'aimed', 'radial'], fireCooldown: 1.35, bulletSpeed: 58, note: 'Swarms and aimed fire together.' },
      { at: 0.66, name: 'Starfall', patterns: ['spiral', 'laser', 'burst'], fireCooldown: 0.95, bulletSpeed: 66, note: 'Spirals, laser sweeps, bursts.' },
      { at: 0.33, name: 'Devour', patterns: ['radial', 'spiral', 'mines', 'burst'], fireCooldown: 0.68, bulletSpeed: 74, note: 'The Citadel itself comes apart.' },
    ],
    reward: 3000,
  },
]

export const BOSS_BY_ID = new Map(BOSSES.map((boss) => [boss.id, boss]))
export const BOSS_BY_SECTOR = new Map(BOSSES.map((boss) => [boss.sector, boss]))

export function bossById(id: string | null): BossSpec | undefined {
  return id ? BOSS_BY_ID.get(id) : undefined
}

export function bossForSector(sector: number): BossSpec {
  return BOSS_BY_SECTOR.get(sector) ?? (BOSSES[0] as BossSpec)
}
