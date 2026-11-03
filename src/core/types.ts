/** Shared data model for missions, saves and validation. */

export type Formation = 'v' | 'line' | 'diamond' | 'wedge' | 'spiral' | 'pincer' | 'swarm' | 'stagger' | 'escort'

export type ObjectiveKind =
  | 'eliminate'
  | 'survive'
  | 'boss'
  | 'elite'
  | 'interception'
  | 'asteroid'
  | 'resource'
  | 'gauntlet'
  | 'escort'
  | 'defense'

export interface MissionObjective {
  kind: ObjectiveKind
  target: number
  label: string
}

export interface WaveEntry {
  archetype: string
  count: number
  formation: Formation
  x: number
  /** Priority targets that fail the mission if they escape. */
  priority?: boolean
}

export interface MissionWave {
  at: number
  entries: WaveEntry[]
}

export interface MissionDefinition {
  id: string
  index: number
  sector: number
  local: number
  seed: number
  name: string
  type: string
  brief: string
  objective: MissionObjective
  waves: MissionWave[]
  duration: number
  difficulty: number
  boss: string | null
  hazards: string[]
  allowedPowerUps: string[]
  starScore: [number, number, number]
  threat: number
  enemyCount: number
}

export interface ValidationRecord {
  status: 'VERIFIED' | 'REJECTED' | 'UNKNOWN'
  issues: string[]
}

export interface MissionProgress {
  stars: number
  score: number
  cleared: boolean
}

export interface PowerupSave {
  unlocked: string[]
  equipped: string
  secondary: string
}

export interface PersistedGame {
  version: number
  progress: Record<number, MissionProgress>
  credits: number
  totalKills: number
  secondaryUsed: string[]
  ships: string[]
  ship: string
  weapons: Record<string, number>
  primary: string
  secondary: string
  cosmetics: { trails: string[]; trail: string; hull: string }
  achievements: string[]
  daily: { date: string; score: number; done: boolean; streak: number }
  endlessBest: number
  bossRushBest: number
  arcadeBest: number
  settings: {
    sound: boolean
    music: boolean
    motion: boolean
    quality: 'low' | 'medium' | 'high'
    highContrast: boolean
    control: 'absolute' | 'relative'
    leftHanded: boolean
    sensitivity: number
  }
  lastMission: number
}
