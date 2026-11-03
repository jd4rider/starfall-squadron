/** Twenty-five enemy archetypes, six factions, and the sector rosters. */

export type Behavior =
  | 'advance'
  | 'sine'
  | 'dive'
  | 'strafe'
  | 'hover'
  | 'kamikaze'
  | 'turret'
  | 'sniper'
  | 'minelayer'
  | 'carrier'
  | 'shield'
  | 'repair'
  | 'teleport'
  | 'leech'
  | 'emp'
  | 'gravity'
  | 'artillery'
  | 'ace'

export type EnemyShape = 'dart' | 'wedge' | 'hex' | 'orb' | 'cruiser' | 'organic' | 'ring'

export interface EnemySpec {
  id: string
  name: string
  faction: string
  behavior: Behavior
  shape: EnemyShape
  hull: number
  speed: number
  radius: number
  threat: number
  score: number
  fireCooldown: number
  bulletDamage: number
  color: string
  accent: string
}

const crimson = '#ff7a59'
const voidGlow = '#a78bfa'
const iron = '#fbbf24'
const crystal = '#67e8f9'
const bio = '#a3e635'
const eclipse = '#f472b6'

export const ENEMIES: EnemySpec[] = [
  { id: 'scout', name: 'Scout', faction: 'crimson', behavior: 'advance', shape: 'dart', hull: 12, speed: 26, radius: 3.2, threat: 1, score: 40, fireCooldown: 1.9, bulletDamage: 5, color: '#8e2233', accent: crimson },
  { id: 'interceptor', name: 'Interceptor', faction: 'crimson', behavior: 'sine', shape: 'dart', hull: 16, speed: 34, radius: 3.4, threat: 1.4, score: 55, fireCooldown: 1.6, bulletDamage: 6, color: '#7f1d1d', accent: '#fca5a5' },
  { id: 'formation', name: 'Formation Fighter', faction: 'crimson', behavior: 'advance', shape: 'wedge', hull: 20, speed: 24, radius: 3.8, threat: 1.6, score: 65, fireCooldown: 2.2, bulletDamage: 6, color: '#9f1239', accent: '#fda4af' },
  { id: 'divebomber', name: 'Dive Bomber', faction: 'crimson', behavior: 'dive', shape: 'wedge', hull: 22, speed: 46, radius: 3.9, threat: 2.1, score: 85, fireCooldown: 2.6, bulletDamage: 8, color: '#7c2d12', accent: '#fdba74' },
  { id: 'heavybomber', name: 'Heavy Bomber', faction: 'iron', behavior: 'advance', shape: 'cruiser', hull: 54, speed: 17, radius: 5.4, threat: 3.2, score: 130, fireCooldown: 2.8, bulletDamage: 10, color: '#44403c', accent: iron },
  { id: 'shieldcarrier', name: 'Shield Carrier', faction: 'crystal', behavior: 'shield', shape: 'hex', hull: 46, speed: 20, radius: 5, threat: 3.4, score: 150, fireCooldown: 3.2, bulletDamage: 7, color: '#155e75', accent: crystal },
  { id: 'missilefrigate', name: 'Missile Frigate', faction: 'iron', behavior: 'hover', shape: 'cruiser', hull: 40, speed: 16, radius: 5.2, threat: 3, score: 140, fireCooldown: 2.4, bulletDamage: 12, color: '#3f3f46', accent: '#fdba74' },
  { id: 'laserturret', name: 'Laser Turret Ship', faction: 'iron', behavior: 'turret', shape: 'orb', hull: 34, speed: 12, radius: 4.2, threat: 2.6, score: 115, fireCooldown: 1.8, bulletDamage: 9, color: '#52525b', accent: '#fca5a5' },
  { id: 'repairdrone', name: 'Repair Drone', faction: 'bioforge', behavior: 'repair', shape: 'orb', hull: 26, speed: 22, radius: 3.4, threat: 2.8, score: 120, fireCooldown: 4.5, bulletDamage: 0, color: '#365314', accent: bio },
  { id: 'supportcarrier', name: 'Support Carrier', faction: 'bioforge', behavior: 'carrier', shape: 'organic', hull: 62, speed: 15, radius: 6.2, threat: 4, score: 190, fireCooldown: 3.6, bulletDamage: 7, color: '#3f6212', accent: '#d9f99d' },
  { id: 'stealthfighter', name: 'Stealth Fighter', faction: 'eclipse', behavior: 'teleport', shape: 'wedge', hull: 30, speed: 40, radius: 3.6, threat: 3.1, score: 155, fireCooldown: 2.2, bulletDamage: 9, color: '#4c1d95', accent: eclipse },
  { id: 'sniper', name: 'Sniper Ship', faction: 'eclipse', behavior: 'sniper', shape: 'dart', hull: 28, speed: 18, radius: 3.2, threat: 3.3, score: 165, fireCooldown: 2.9, bulletDamage: 16, color: '#581c87', accent: '#f9a8d4' },
  { id: 'kamikaze', name: 'Kamikaze Drone', faction: 'crimson', behavior: 'kamikaze', shape: 'orb', hull: 14, speed: 62, radius: 3, threat: 1.8, score: 70, fireCooldown: 99, bulletDamage: 18, color: '#b91c1c', accent: '#fecaca' },
  { id: 'minelayer', name: 'Mine Layer', faction: 'iron', behavior: 'minelayer', shape: 'hex', hull: 44, speed: 20, radius: 4.8, threat: 3.2, score: 160, fireCooldown: 3.4, bulletDamage: 14, color: '#57534e', accent: '#fbbf24' },
  { id: 'swarmcarrier', name: 'Drone Swarm Carrier', faction: 'bioforge', behavior: 'carrier', shape: 'organic', hull: 70, speed: 14, radius: 6.6, threat: 4.4, score: 210, fireCooldown: 3.2, bulletDamage: 6, color: '#365314', accent: '#a3e635' },
  { id: 'destroyer', name: 'Armored Destroyer', faction: 'iron', behavior: 'advance', shape: 'cruiser', hull: 110, speed: 13, radius: 7.2, threat: 5.2, score: 280, fireCooldown: 2.2, bulletDamage: 12, color: '#292524', accent: '#fbbf24' },
  { id: 'leech', name: 'Energy Leech', faction: 'void', behavior: 'leech', shape: 'organic', hull: 38, speed: 30, radius: 4, threat: 3.4, score: 175, fireCooldown: 3, bulletDamage: 6, color: '#3b0764', accent: voidGlow },
  { id: 'empship', name: 'EMP Ship', faction: 'void', behavior: 'emp', shape: 'orb', hull: 44, speed: 19, radius: 4.6, threat: 3.8, score: 195, fireCooldown: 3.8, bulletDamage: 5, color: '#4c1d95', accent: '#c4b5fd' },
  { id: 'teleporter', name: 'Teleport Fighter', faction: 'eclipse', behavior: 'teleport', shape: 'dart', hull: 34, speed: 38, radius: 3.6, threat: 3.6, score: 185, fireCooldown: 2, bulletDamage: 10, color: '#6d28d9', accent: '#f0abfc' },
  { id: 'gravitywell', name: 'Gravity Disruptor', faction: 'void', behavior: 'gravity', shape: 'ring', hull: 58, speed: 14, radius: 5.6, threat: 4.6, score: 230, fireCooldown: 4.2, bulletDamage: 8, color: '#312e81', accent: '#e879f9' },
  { id: 'artillery', name: 'Plasma Artillery', faction: 'iron', behavior: 'artillery', shape: 'wedge', hull: 66, speed: 15, radius: 5.8, threat: 4.4, score: 240, fireCooldown: 3.6, bulletDamage: 15, color: '#78350f', accent: '#fb923c' },
  { id: 'shieldgen', name: 'Shield Generator', faction: 'crystal', behavior: 'shield', shape: 'ring', hull: 72, speed: 12, radius: 5.4, threat: 4.8, score: 250, fireCooldown: 4, bulletDamage: 0, color: '#0e7490', accent: '#a5f3fc' },
  { id: 'minicapital', name: 'Mini Capital Ship', faction: 'iron', behavior: 'advance', shape: 'cruiser', hull: 160, speed: 10, radius: 8.6, threat: 6.5, score: 380, fireCooldown: 2.6, bulletDamage: 13, color: '#1c1917', accent: '#fcd34d' },
  { id: 'ace', name: 'Elite Ace Fighter', faction: 'eclipse', behavior: 'ace', shape: 'wedge', hull: 74, speed: 44, radius: 4.2, threat: 5.4, score: 320, fireCooldown: 1.7, bulletDamage: 12, color: '#831843', accent: '#f9a8d4' },
  { id: 'miniboss', name: 'Miniboss Cruiser', faction: 'void', behavior: 'ace', shape: 'cruiser', hull: 230, speed: 16, radius: 9.4, threat: 8, score: 520, fireCooldown: 1.9, bulletDamage: 14, color: '#2e1065', accent: '#d8b4fe' },
]

export const ENEMY_BY_ID = new Map(ENEMIES.map((enemy) => [enemy.id, enemy]))

export function enemyById(id: string): EnemySpec {
  return ENEMY_BY_ID.get(id) ?? (ENEMIES[0] as EnemySpec)
}

/** Rosters widen as sectors open up; every sector keeps a signature ship. */
export const SECTOR_ROSTER: string[][] = [
  ['scout', 'interceptor', 'formation'],
  ['scout', 'interceptor', 'formation', 'divebomber', 'missilefrigate'],
  ['interceptor', 'formation', 'shieldcarrier', 'laserturret', 'sniper'],
  ['divebomber', 'heavybomber', 'missilefrigate', 'kamikaze', 'artillery'],
  ['heavybomber', 'shieldcarrier', 'supportcarrier', 'repairdrone', 'sniper'],
  ['laserturret', 'empship', 'leech', 'shieldgen', 'ace'],
  ['gravitywell', 'artillery', 'teleporter', 'empship', 'minelayer'],
  ['stealthfighter', 'teleporter', 'sniper', 'ace', 'repairdrone'],
  ['destroyer', 'minicapital', 'shieldgen', 'artillery', 'heavybomber'],
  ['ace', 'miniboss', 'teleporter', 'gravitywell', 'destroyer', 'stealthfighter'],
]
