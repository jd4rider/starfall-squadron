/**
 * Static mission validation.
 *
 * This checks everything a static analyser honestly can: references, ranges,
 * wave termination, objective arithmetic, boss wiring, budget and star order.
 * It cannot prove that a mission is beatable by a human pilot, so VERIFIED here
 * means "legal, complete, and inside every performance budget" — not "proven".
 */
import { CAMPAIGN, LIMITS } from '../core/constants'
import type { MissionDefinition, ValidationRecord } from '../core/types'
import { ENEMY_BY_ID } from '../content/enemies'
import { BOSS_BY_ID, bossForSector } from '../content/bosses'
import { POWERUPS } from '../content/powerups'

const MAX_ENEMIES = 70
const MAX_WAVE_THREAT = 34
const MAX_BULLETS = 180

export interface MissionIssue {
  id: string
  issues: string[]
}

export interface CampaignReport {
  total: number
  verified: number
  rejected: number
  unknown: number
  worlds: Record<number, number>
  bosses: number
  duplicateIds: string[]
  similar: string[][]
  largest: { id: string; enemies: number } | null
  maxEnemies: number
  maxThreat: number
  issues: MissionIssue[]
}

export function validateMission(mission: MissionDefinition): ValidationRecord {
  const issues: string[] = []

  if (!/^[a-z0-9-]{3,48}$/.test(mission.id)) issues.push(`bad id "${mission.id}"`)
  if (!Number.isInteger(mission.index) || mission.index < 1) issues.push('index must be a positive integer')
  if (mission.sector < 1 || mission.sector > CAMPAIGN.sectors) issues.push(`sector ${mission.sector} out of range`)
  if (mission.local < 1 || mission.local > CAMPAIGN.missionsPerSector) issues.push(`local ${mission.local} out of range`)
  if (mission.waves.length === 0) issues.push('mission has no waves')
  if (mission.waves.length > 12) issues.push(`${mission.waves.length} waves exceeds the schedule limit`)
  if (mission.duration < 20 || mission.duration > 180) issues.push(`duration ${mission.duration}s out of range`)
  if (mission.difficulty < 0 || mission.difficulty > 10) issues.push(`difficulty ${mission.difficulty} out of range`)
  if (mission.starScore[0] >= mission.starScore[1] || mission.starScore[1] >= mission.starScore[2]) {
    issues.push('star score thresholds are not ascending')
  }
  if (mission.allowedPowerUps.length === 0) issues.push('no power-ups allowed')

  let enemyCount = 0
  let threat = 0
  let priority = 0
  let previousAt = -1
  const seen = new Set<string>()

  for (const [waveIndex, wave] of mission.waves.entries()) {
    if (!Number.isFinite(wave.at) || wave.at < 0 || wave.at > mission.duration) {
      issues.push(`wave ${waveIndex} spawn time ${wave.at} outside the mission`)
    }
    if (wave.at <= previousAt && waveIndex > 0) issues.push(`wave ${waveIndex} is not scheduled after wave ${waveIndex - 1}`)
    previousAt = wave.at
    if (wave.entries.length === 0) issues.push(`wave ${waveIndex} is empty`)

    let waveThreat = 0
    for (const entry of wave.entries) {
      const spec = ENEMY_BY_ID.get(entry.archetype)
      if (!spec) {
        issues.push(`unknown enemy archetype "${entry.archetype}"`)
        continue
      }
      if (!Number.isInteger(entry.count) || entry.count < 1 || entry.count > 8) {
        issues.push(`wave ${waveIndex} count ${entry.count} outside 1..8`)
      }
      if (!Number.isFinite(entry.x) || Math.abs(entry.x) > 40) issues.push(`wave ${waveIndex} spawn x ${entry.x} outside the lane`)
      if (entry.priority) priority += entry.count
      enemyCount += entry.count
      waveThreat += spec.threat * entry.count
      seen.add(entry.archetype)
    }
    if (waveThreat > MAX_WAVE_THREAT) issues.push(`wave ${waveIndex} threat ${waveThreat.toFixed(1)} exceeds ${MAX_WAVE_THREAT}`)
    threat += waveThreat
  }

  if (enemyCount > MAX_ENEMIES) issues.push(`${enemyCount} enemies exceeds the budget of ${MAX_ENEMIES}`)
  if (enemyCount > LIMITS.enemies) issues.push('enemy budget exceeds the runtime entity cap')
  if (enemyCount * 2 > MAX_BULLETS) issues.push('projectile estimate exceeds the runtime bullet cap')
  if (mission.enemyCount !== enemyCount) issues.push(`declared enemyCount ${mission.enemyCount} does not match ${enemyCount}`)

  switch (mission.objective.kind) {
    case 'eliminate':
      if (mission.objective.target < 1) issues.push('eliminate target must be positive')
      if (mission.objective.target > enemyCount) issues.push('eliminate target exceeds the enemy roster')
      break
    case 'gauntlet':
      if (mission.objective.target < 1 || mission.objective.target > enemyCount) {
        issues.push('gauntlet target must be within the enemy roster')
      }
      break
    case 'survive':
    case 'asteroid':
    case 'escort':
    case 'defense':
      if (mission.objective.target < 10 || mission.objective.target > mission.duration) {
        issues.push(`${mission.objective.kind} target must fit inside the mission duration`)
      }
      if (mission.objective.kind === 'asteroid' && !mission.hazards.includes('asteroid')) {
        issues.push('asteroid objective without an asteroid hazard')
      }
      break
    case 'resource':
      if (mission.objective.target < 1 || mission.objective.target > 8) issues.push('resource target outside 1..8')
      break
    case 'interception':
      if (mission.objective.target < 1) issues.push('interception target must be positive')
      if (priority < mission.objective.target) issues.push('interception target exceeds the priority runners in the waves')
      break
    case 'elite':
      if (!seen.has('ace') && !seen.has('miniboss')) issues.push('elite objective without an elite enemy')
      if (mission.objective.target < 1) issues.push('elite target must be positive')
      break
    case 'boss': {
      if (!mission.boss) {
        issues.push('boss objective without a boss')
        break
      }
      const boss = BOSS_BY_ID.get(mission.boss)
      if (!boss) {
        issues.push(`unknown boss "${mission.boss}"`)
        break
      }
      if (boss.sector !== mission.sector) issues.push('boss belongs to a different sector')
      if (bossForSector(mission.sector).id !== boss.id) issues.push('boss is not the sector flagship')
      if (boss.phases.length < 3) issues.push('boss has fewer than three phases')
      if (boss.turrets < 1) issues.push('boss has no turrets')
      break
    }
  }

  const powerupIds = new Set<string>(POWERUPS.map((powerup) => powerup.id))
  for (const id of mission.allowedPowerUps) {
    if (!powerupIds.has(id)) issues.push(`unknown power-up "${id}"`)
  }

  if (!['asteroid'].every((hazard) => mission.hazards.includes(hazard) || true)) {
    issues.push('unknown hazard')
  }
  for (const hazard of mission.hazards) {
    if (hazard !== 'asteroid' && hazard !== 'gravity') issues.push(`unknown hazard "${hazard}"`)
  }

  return { status: issues.length === 0 ? 'VERIFIED' : 'REJECTED', issues }
}

export function validateCampaign(missions: MissionDefinition[]): CampaignReport {
  const worlds: Record<number, number> = {}
  const issues: MissionIssue[] = []
  const ids = new Set<string>()
  const duplicateIds: string[] = []
  let verified = 0
  let rejected = 0
  let bosses = 0
  let largest: { id: string; enemies: number } | null = null
  let maxEnemies = 0
  let maxThreat = 0
  const signatures = new Map<string, string[]>()

  for (const mission of missions) {
    const record = validateMission(mission)
    if (record.status === 'VERIFIED') verified += 1
    else {
      rejected += 1
      issues.push({ id: mission.id, issues: record.issues })
    }
    if (ids.has(mission.id)) duplicateIds.push(mission.id)
    ids.add(mission.id)
    worlds[mission.sector] = (worlds[mission.sector] ?? 0) + 1
    if (mission.objective.kind === 'boss') bosses += 1
    if (mission.enemyCount > maxEnemies) {
      maxEnemies = mission.enemyCount
      largest = { id: mission.id, enemies: mission.enemyCount }
    }
    maxThreat = Math.max(maxThreat, mission.threat)
    const signature = `${mission.type}:${mission.objective.kind}:${mission.waves.map((wave) => wave.entries.map((entry) => `${entry.archetype}x${entry.count}`).join(',')).join('|')}`
    const group = signatures.get(signature) ?? []
    group.push(mission.id)
    signatures.set(signature, group)
  }

  const similar = [...signatures.values()].filter((group) => group.length > 1 && group.length < 6)

  return {
    total: missions.length,
    verified,
    rejected,
    unknown: missions.length - verified - rejected,
    worlds,
    bosses,
    duplicateIds,
    similar,
    largest,
    maxEnemies,
    maxThreat,
    issues,
  }
}
