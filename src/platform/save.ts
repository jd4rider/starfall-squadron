import { CAMPAIGN } from '../core/constants'
import type { MissionDefinition, PersistedGame } from '../core/types'
import { SHIPS, shipById } from '../content/ships'

export const SAVE_KEY = 'starfall-squadron-save-v1'

export const ACHIEVEMENTS: { id: string; name: string; blurb: string }[] = [
  { id: 'first-contact', name: 'First Contact', blurb: 'Clear your first mission.' },
  { id: 'squadron-rookie', name: 'Squadron Rookie', blurb: 'Clear ten missions.' },
  { id: 'alien-hunter', name: 'Alien Hunter', blurb: 'Destroy 250 hostiles.' },
  { id: 'shield-master', name: 'Shield Master', blurb: 'Finish a mission without losing shields.' },
  { id: 'missile-commander', name: 'Missile Commander', blurb: 'Use every secondary weapon type.' },
  { id: 'drone-specialist', name: 'Drone Specialist', blurb: 'Fly with two drones at once.' },
  { id: 'boss-breaker', name: 'Boss Breaker', blurb: 'Destroy any sector boss.' },
  { id: 'sector-liberator', name: 'Sector Liberator', blurb: 'Clear all thirty missions in a sector.' },
  { id: 'missions-100', name: 'Century Pilot', blurb: 'Clear 100 missions.' },
  { id: 'missions-200', name: 'Veteran', blurb: 'Clear 200 missions.' },
  { id: 'missions-300', name: 'Squadron Legend', blurb: 'Clear all 300 missions.' },
  { id: 'endless-survivor', name: 'Endless Survivor', blurb: 'Reach wave 10 in Endless Survival.' },
  { id: 'starfall-legend', name: 'Starfall Legend', blurb: 'Earn three stars on a Citadel mission.' },
  { id: 'hangar-collector', name: 'Hangar Collector', blurb: 'Own five different ships.' },
  { id: 'daily-habit', name: 'Daily Habit', blurb: 'Complete a daily sortie.' },
  { id: 'rush-hour', name: 'Rush Hour', blurb: 'Clear three bosses in one Boss Rush.' },
]

export function createSave(): PersistedGame {
  return {
    version: 2,
    progress: {},
    credits: 0,
    totalKills: 0,
    secondaryUsed: [],
    ships: ['falcon'],
    ship: 'falcon',
    weapons: { pulse: 1, spread: 1, beam: 1, ion: 1, photon: 1, rail: 1, arc: 1, particle: 1, fusion: 1, wave: 1 },
    primary: 'pulse',
    secondary: 'missiles',
    cosmetics: { trails: ['std'], trail: 'std', hull: 'std' },
    achievements: [],
    daily: { date: '', score: 0, done: false, streak: 0 },
    endlessBest: 0,
    bossRushBest: 0,
    arcadeBest: 0,
    settings: {
      sound: true,
      music: true,
      motion: true,
      quality: 'high',
      highContrast: false,
      control: 'absolute',
      leftHanded: false,
      sensitivity: 1,
    },
    lastMission: 1,
  }
}

function isSave(value: unknown): value is PersistedGame {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<PersistedGame>
  return typeof candidate.version === 'number' && typeof candidate.ship === 'string' && Boolean(candidate.settings)
}

/** Reads and upgrades old saves instead of throwing progress away. */
export function loadSave(): PersistedGame {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return createSave()
    const parsed: unknown = JSON.parse(raw)
    if (!isSave(parsed)) return createSave()
    const base = createSave()
    const merged: PersistedGame = {
      ...base,
      ...parsed,
      progress: { ...base.progress, ...(parsed.progress ?? {}) },
      weapons: { ...base.weapons, ...(parsed.weapons ?? {}) },
      cosmetics: { ...base.cosmetics, ...(parsed.cosmetics ?? {}) },
      settings: { ...base.settings, ...(parsed.settings ?? {}) },
      daily: { ...base.daily, ...(parsed.daily ?? {}) },
      ships: Array.isArray(parsed.ships) && parsed.ships.length > 0 ? parsed.ships : base.ships,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      totalKills: typeof parsed.totalKills === 'number' ? parsed.totalKills : 0,
      secondaryUsed: Array.isArray(parsed.secondaryUsed) ? parsed.secondaryUsed : [],
    }
    if (!merged.ships.includes(merged.ship)) merged.ship = merged.ships[0] ?? 'falcon'
    if (!merged.ships.includes('falcon')) merged.ships.unshift('falcon')
    merged.version = 2
    return merged
  } catch {
    return createSave()
  }
}

export function writeSave(save: PersistedGame): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save))
  } catch {
    // Private mode: the run still works, it just will not persist.
  }
}

export function clearedCount(save: PersistedGame): number {
  return Object.values(save.progress).filter((entry) => entry.cleared).length
}

export function totalStars(save: PersistedGame): number {
  return Object.values(save.progress).reduce((sum, entry) => sum + entry.stars, 0)
}

export function isMissionUnlocked(save: PersistedGame, index: number): boolean {
  if (index <= 1) return true
  const previous = save.progress[index - 1]
  return Boolean(previous?.cleared)
}

export function isSectorUnlocked(save: PersistedGame, sector: number): boolean {
  const first = (sector - 1) * CAMPAIGN.missionsPerSector + 1
  return isMissionUnlocked(save, first)
}

export function sectorProgress(save: PersistedGame, sector: number): { cleared: number; stars: number } {
  let cleared = 0
  let stars = 0
  for (let local = 1; local <= CAMPAIGN.missionsPerSector; local += 1) {
    const index = (sector - 1) * CAMPAIGN.missionsPerSector + local
    const entry = save.progress[index]
    if (entry?.cleared) cleared += 1
    stars += entry?.stars ?? 0
  }
  return { cleared, stars }
}

export interface MissionResult {
  mission: MissionDefinition
  score: number
  stars: number
  credits: number
  newBest: boolean
  newStars: boolean
}

/** Records a result and returns what actually changed. */
export function recordMission(save: PersistedGame, mission: MissionDefinition, score: number, stars: number, credits: number): MissionResult {
  const previous = save.progress[mission.index]
  const newBest = !previous || score > previous.score
  const newStars = !previous || stars > previous.stars
  save.progress[mission.index] = {
    stars: Math.max(previous?.stars ?? 0, stars),
    score: Math.max(previous?.score ?? 0, score),
    cleared: true,
  }
  save.credits += credits
  if (mission.index > save.lastMission) save.lastMission = Math.min(CAMPAIGN.missions, mission.index + 1)
  return { mission, score, stars, credits, newBest, newStars }
}

export function buyShip(save: PersistedGame, shipId: string): boolean {
  const ship = shipById(shipId)
  if (save.ships.includes(shipId)) return false
  if (save.credits < ship.cost) return false
  save.credits -= ship.cost
  save.ships.push(shipId)
  return true
}

export function buyWeaponLevel(save: PersistedGame, weaponId: string): boolean {
  const level = save.weapons[weaponId] ?? 1
  if (level >= 5) return false
  const cost = 350 * level
  if (save.credits < cost) return false
  save.credits -= cost
  save.weapons[weaponId] = level + 1
  return true
}

export function buyCosmetic(save: PersistedGame, id: string, cost: number): boolean {
  if (save.cosmetics.trails.includes(id)) return false
  if (save.credits < cost) return false
  save.credits -= cost
  save.cosmetics.trails.push(id)
  return true
}

export function equipShip(save: PersistedGame, shipId: string): void {
  if (save.ships.includes(shipId)) save.ship = shipId
}

export function millionaire(save: PersistedGame): boolean {
  return save.credits >= 10000
}

export function shipCount(save: PersistedGame): number {
  return save.ships.length
}

export function allShips(): typeof SHIPS {
  return SHIPS
}
