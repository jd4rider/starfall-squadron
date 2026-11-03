/** Forty collectible power-ups. Every entry is wired to a real effect in the sim. */

export type EffectId =
  | 'weaponUp'
  | 'weaponSwap'
  | 'rapid'
  | 'double'
  | 'triple'
  | 'spread'
  | 'laserUp'
  | 'plasmaUp'
  | 'missiles'
  | 'missileBarrage'
  | 'shieldRecharge'
  | 'megaShield'
  | 'invuln'
  | 'hullRepair'
  | 'fullRepair'
  | 'extraLife'
  | 'speedBoost'
  | 'timeSlow'
  | 'emp'
  | 'screenBomb'
  | 'megaBomb'
  | 'drone'
  | 'twinDrone'
  | 'droneUpgrade'
  | 'damageBoost'
  | 'critBoost'
  | 'energyRegen'
  | 'reflect'
  | 'magnet'
  | 'scoreMult'
  | 'credits'
  | 'chain'
  | 'pierce'
  | 'explosive'
  | 'phoenix'
  | 'gravity'
  | 'repairDrone'
  | 'shieldDrone'
  | 'overdrive'
  | 'starfall'

export interface PowerupSpec {
  id: EffectId
  name: string
  glyph: string
  blurb: string
  rarity: 1 | 2 | 3 | 4
  duration: number
  color: string
}

export const POWERUPS: PowerupSpec[] = [
  { id: 'weaponUp', name: 'Weapon Upgrade', glyph: '▲', blurb: 'One level on the current primary.', rarity: 2, duration: 0, color: '#4de1ff' },
  { id: 'weaponSwap', name: 'Weapon Swap', glyph: '⇄', blurb: 'Cycles to the next primary weapon.', rarity: 2, duration: 0, color: '#a5b4fc' },
  { id: 'rapid', name: 'Rapid Fire', glyph: '⚡', blurb: 'Firing cooldown cut by 40%.', rarity: 1, duration: 12, color: '#fde68a' },
  { id: 'double', name: 'Double Shot', glyph: '∥', blurb: 'Adds a second stream.', rarity: 1, duration: 14, color: '#8ef0c8' },
  { id: 'triple', name: 'Triple Shot', glyph: '⋔', blurb: 'Adds a third stream.', rarity: 2, duration: 14, color: '#6ee7b7' },
  { id: 'spread', name: 'Spread Shot', glyph: '⋁', blurb: 'Fires an extra-wide fan.', rarity: 2, duration: 14, color: '#c4b5fd' },
  { id: 'laserUp', name: 'Laser Upgrade', glyph: '⌁', blurb: 'Beam damage and penetration up.', rarity: 2, duration: 15, color: '#a5f3fc' },
  { id: 'plasmaUp', name: 'Plasma Upgrade', glyph: '◉', blurb: 'Plasma damage and splash up.', rarity: 2, duration: 15, color: '#e879f9' },
  { id: 'missiles', name: 'Homing Missiles', glyph: '➤', blurb: 'Passive seekers launch every second.', rarity: 2, duration: 16, color: '#fdba74' },
  { id: 'missileBarrage', name: 'Missile Barrage', glyph: '⇶', blurb: 'Twelve missiles, all at once.', rarity: 3, duration: 0, color: '#fb923c' },
  { id: 'shieldRecharge', name: 'Shield Recharge', glyph: '◍', blurb: 'Restores half the shield bubble.', rarity: 1, duration: 0, color: '#67e8f9' },
  { id: 'megaShield', name: 'Mega Shield', glyph: '◎', blurb: 'Doubles shield capacity for a while.', rarity: 3, duration: 14, color: '#22d3ee' },
  { id: 'invuln', name: 'Invulnerability', glyph: '✧', blurb: 'Six seconds of immunity.', rarity: 3, duration: 6, color: '#fef08a' },
  { id: 'hullRepair', name: 'Hull Repair', glyph: '✚', blurb: 'Restores 35 hull.', rarity: 1, duration: 0, color: '#86efac' },
  { id: 'fullRepair', name: 'Full Repair', glyph: '✚✚', blurb: 'Restores hull and shields completely.', rarity: 4, duration: 0, color: '#4ade80' },
  { id: 'extraLife', name: 'Extra Life', glyph: '♥', blurb: 'One more life, up to five.', rarity: 4, duration: 0, color: '#fb7185' },
  { id: 'speedBoost', name: 'Speed Boost', glyph: '»', blurb: 'Movement speed up 35%.', rarity: 1, duration: 12, color: '#5eead4' },
  { id: 'timeSlow', name: 'Time Slow', glyph: '◷', blurb: 'Enemies and bullets slow down.', rarity: 3, duration: 8, color: '#bae6fd' },
  { id: 'emp', name: 'EMP Blast', glyph: '⌾', blurb: 'Disables every enemy briefly.', rarity: 2, duration: 0, color: '#a5f3fc' },
  { id: 'screenBomb', name: 'Screen Bomb', glyph: '✸', blurb: 'Adds a screen-clearing bomb charge.', rarity: 2, duration: 0, color: '#fbbf24' },
  { id: 'megaBomb', name: 'Mega Bomb', glyph: '✹', blurb: 'Adds two bomb charges.', rarity: 3, duration: 0, color: '#f97316' },
  { id: 'drone', name: 'Companion Drone', glyph: '◆', blurb: 'One support drone joins the wing.', rarity: 2, duration: 18, color: '#93c5fd' },
  { id: 'twinDrone', name: 'Twin Drones', glyph: '◈', blurb: 'Two support drones.', rarity: 3, duration: 18, color: '#60a5fa' },
  { id: 'droneUpgrade', name: 'Drone Upgrade', glyph: '◇', blurb: 'Drones fire faster and hit harder.', rarity: 3, duration: 16, color: '#818cf8' },
  { id: 'damageBoost', name: 'Damage Boost', glyph: '✦', blurb: 'All damage up 30%.', rarity: 2, duration: 12, color: '#fca5a5' },
  { id: 'critBoost', name: 'Critical Boost', glyph: '✷', blurb: 'Critical chance up to 45%.', rarity: 3, duration: 14, color: '#f9a8d4' },
  { id: 'energyRegen', name: 'Energy Regen', glyph: '◌', blurb: 'Ability and secondary cooldowns drop.', rarity: 2, duration: 14, color: '#a7f3d0' },
  { id: 'reflect', name: 'Projectile Reflect', glyph: '⟲', blurb: 'Enemy shots bounce back for 8s.', rarity: 4, duration: 8, color: '#fef3c7' },
  { id: 'magnet', name: 'Magnet Field', glyph: '⊃', blurb: 'Pickups fly to your ship.', rarity: 1, duration: 16, color: '#f0abfc' },
  { id: 'scoreMult', name: 'Score Multiplier', glyph: '×2', blurb: 'Double points for 18s.', rarity: 2, duration: 18, color: '#fcd34d' },
  { id: 'credits', name: 'Credit Bonus', glyph: '¤', blurb: 'A handful of credits, banked now.', rarity: 1, duration: 0, color: '#fde047' },
  { id: 'chain', name: 'Chain Lightning', glyph: '⌁⌁', blurb: 'Shots arc to nearby enemies.', rarity: 3, duration: 14, color: '#c4b5fd' },
  { id: 'pierce', name: 'Piercing Shots', glyph: '⇢', blurb: 'Shots pass through two hulls.', rarity: 2, duration: 14, color: '#e2e8f0' },
  { id: 'explosive', name: 'Explosive Rounds', glyph: '✺', blurb: 'Every hit splashes to neighbours.', rarity: 3, duration: 14, color: '#fb923c' },
  { id: 'phoenix', name: 'Phoenix Burst', glyph: '✵', blurb: 'A radial fire wave, right now.', rarity: 3, duration: 0, color: '#f97316' },
  { id: 'gravity', name: 'Gravity Pulse', glyph: '◉', blurb: 'Throws every nearby threat away.', rarity: 2, duration: 0, color: '#c084fc' },
  { id: 'repairDrone', name: 'Repair Drone', glyph: '✚◆', blurb: 'Bleeds hull back for 20s.', rarity: 3, duration: 20, color: '#6ee7b7' },
  { id: 'shieldDrone', name: 'Shield Drone', glyph: '◍◆', blurb: 'Intercepts incoming fire for 20s.', rarity: 3, duration: 20, color: '#38bdf8' },
  { id: 'overdrive', name: 'Overdrive', glyph: '⏫', blurb: 'Everything offensive, doubled.', rarity: 4, duration: 9, color: '#f43f5e' },
  { id: 'starfall', name: 'Starfall Strike', glyph: '☄', blurb: 'The squadron calls in a strike.', rarity: 4, duration: 0, color: '#facc15' },
]

export const POWERUP_BY_ID = new Map(POWERUPS.map((powerup) => [powerup.id, powerup]))

export function powerupById(id: string): PowerupSpec {
  return POWERUP_BY_ID.get(id as EffectId) ?? (POWERUPS[0] as PowerupSpec)
}

/** Weighted common → epic drop pool. */
export const DROP_WEIGHTS: Record<number, number> = { 1: 62, 2: 26, 3: 9, 4: 3 }

export const NEGATIVE_FREE = POWERUPS
