/**
 * Mission generation.
 *
 * The campaign is deterministic: mission `index` seeds everything, so the
 * validation script and the game agree on every wave, every enemy and every
 * score threshold. The first fifteen missions are curated (one idea at a time),
 * sector finales are boss fights, and the rest are seeded from a threat budget.
 */
import { CAMPAIGN } from '../core/constants'
import { hashSeed, intBetween, mulberry32, pick, shuffle, type Rng } from '../core/rng'
import { SECTOR_ROSTER, enemyById } from '../content/enemies'
import { bossForSector } from '../content/bosses'
import { POWERUPS } from '../content/powerups'
import type { Formation, MissionDefinition, MissionObjective, MissionWave, ObjectiveKind, WaveEntry } from '../core/types'

const FORMATIONS: Formation[] = ['v', 'line', 'diamond', 'wedge', 'spiral', 'pincer', 'swarm', 'stagger', 'escort']

const OBJECTIVE_NAMES: Record<ObjectiveKind, string[]> = {
  eliminate: ['Patrol Sweep', 'Clear the Lane', 'Hunter Detail', 'Sweep and Burn', 'Contact Report'],
  survive: ['Hold the Line', 'Holding Pattern', 'Under Siege', 'Wait It Out', 'Last Stand'],
  boss: ['Capital Contact', 'Sector Flagship', 'Break the Hull', 'Final Approach', 'Citadel Gate'],
  elite: ['Elite Sighted', 'Cruiser Hunt', 'Ace Down', 'Priority Kill', 'Heavy Contact'],
  interception: ['Runners', 'Stop Them', 'Closing Window', 'Intercept', 'No Escape'],
  asteroid: ['Debris Field', 'Rock Run', 'Through the Belt', 'Asteroid Alley', 'Tight Quarters'],
  resource: ['Recovery', 'Salvage Run', 'Cores First', 'Gather and Go', 'Supply Drop'],
  gauntlet: ['Gauntlet', 'No Respite', 'Wave After Wave', 'The Long Fight', 'Attrition'],
  escort: ['Courier Run', 'Escort Duty', 'Keep It Alive', 'Safe Passage', 'Shepherd'],
  defense: ['Station Watch', 'Hold the Dock', 'Shield Wall', 'Protect the Relay', 'Garrison'],
}

const BRIEFS: Record<ObjectiveKind, string> = {
  eliminate: 'Thin out the patrol before it can call for help.',
  survive: 'The squadron cannot withdraw yet. Stay alive until the window closes.',
  boss: 'A capital ship is in the lane. Take it apart piece by piece.',
  elite: 'Elite cruisers are screening the fleet. Break them.',
  interception: 'Priority runners are breaking for the jump point. Do not let them leave.',
  asteroid: 'A debris field sits between you and the objective. Fly it.',
  resource: 'Energy cores are drifting in the wreckage. Recover them.',
  gauntlet: 'No resupply, no pause. Clear every wave.',
  escort: 'A courier is carrying the sector plans. Keep it in one piece.',
  defense: 'A relay station is under fire. Nothing gets through.',
}

/** Curated opening missions, in order. */
const TUTORIALS: { name: string; kind: ObjectiveKind; target: number; brief: string }[] = [
  { name: 'First Contact', kind: 'eliminate', target: 6, brief: 'Scouts only. Drag anywhere in the lower half of the screen to fly, and your cannon fires itself.' },
  { name: 'Two Directions', kind: 'eliminate', target: 9, brief: 'Interceptors weave. Lead them or let the stream do the work.' },
  { name: 'Formation Flying', kind: 'eliminate', target: 12, brief: 'They arrive in a V. Break the point and the rest scatter.' },
  { name: 'Hold the Line', kind: 'survive', target: 30, brief: 'Survive for thirty seconds. Pickups are falling: grab the green ones.' },
  { name: 'Salvage', kind: 'resource', target: 4, brief: 'Collect four energy cores. They drift down the lane with the wreckage.' },
  { name: 'First Blood', kind: 'eliminate', target: 16, brief: 'More of the same, faster. Watch the bottom of the screen.' },
  { name: 'Runners', kind: 'interception', target: 4, brief: 'Marked runners must not escape off the bottom of the screen.' },
  { name: 'Debris', kind: 'asteroid', target: 25, brief: 'Rocks cannot be ignored. Shoot the small ones, dodge the big ones.' },
  { name: 'Cover', kind: 'escort', target: 30, brief: 'Keep the courier alive for thirty seconds. It will not dodge for you.' },
  { name: 'Station Watch', kind: 'defense', target: 30, brief: 'The relay is taking fire. Keep the lane clear.' },
  { name: 'Wingmates', kind: 'eliminate', target: 20, brief: 'Drones and upgrades stack. Try the secondary weapon button.' },
  { name: 'Ace', kind: 'elite', target: 1, brief: 'An elite ace is in the lane. It dodges, so trap it against a wall.' },
  { name: 'Gauntlet', kind: 'gauntlet', target: 24, brief: 'Every archetype you have met so far, in one run.' },
  { name: 'Long Patrol', kind: 'survive', target: 45, brief: 'Forty-five seconds. Shield pickups are rarer out here.' },
  { name: 'Ace Wing', kind: 'elite', target: 1, brief: 'An elite ace is screening the lane. Break it and the rest scatter.' },
]

function kindFor(sector: number, local: number): ObjectiveKind {
  if (local === CAMPAIGN.missionsPerSector) return 'boss'
  if (local === 25) return 'gauntlet'
  if (local === 20) return 'elite'
  if (local === 15) return 'defense'
  if (local === 10) return 'interception'
  const cycle: ObjectiveKind[] = ['eliminate', 'survive', 'resource', 'asteroid', 'eliminate', 'escort', 'eliminate']
  return cycle[(local + sector * 2) % cycle.length] as ObjectiveKind
}

function rosterFor(sector: number): string[] {
  return SECTOR_ROSTER[Math.max(0, Math.min(SECTOR_ROSTER.length - 1, sector - 1))] as string[]
}

function formationFor(rng: Rng): Formation {
  return pick(rng, FORMATIONS)
}

function makeEntry(rng: Rng, archetype: string, x: number, priority: boolean): WaveEntry {
  const spec = enemyById(archetype)
  const count = spec.threat >= 5 ? intBetween(rng, 1, 2) : spec.threat >= 3 ? intBetween(rng, 2, 3) : intBetween(rng, 3, 5)
  return { archetype, count, formation: formationFor(rng), x, priority }
}

function difficultyOf(sector: number, local: number): number {
  return Math.min(10, Number(((sector - 1) * 0.92 + (local / CAMPAIGN.missionsPerSector) * 3.1).toFixed(2)))
}

function objectiveFor(kind: ObjectiveKind, target: number, enemyCount: number, bossName: string): MissionObjective {
  switch (kind) {
    case 'eliminate':
      return { kind, target: Math.max(4, Math.min(target, enemyCount)), label: `Destroy ${Math.max(4, Math.min(target, enemyCount))} hostiles` }
    case 'survive':
      return { kind, target, label: `Survive ${target}s` }
    case 'boss':
      return { kind, target: 1, label: `Destroy ${bossName}` }
    case 'elite':
      return { kind, target, label: `Destroy ${target} elite ${target === 1 ? 'ace' : 'aces'}` }
    case 'interception':
      return { kind, target, label: `Stop ${target} runners escaping` }
    case 'asteroid':
      return { kind, target, label: `Survive the debris field for ${target}s` }
    case 'resource':
      return { kind, target, label: `Recover ${target} energy cores` }
    case 'gauntlet':
      return { kind, target: enemyCount, label: `Clear all ${enemyCount} hostiles` }
    case 'escort':
      return { kind, target, label: `Protect the courier for ${target}s` }
    case 'defense':
      return { kind, target, label: `Defend the relay for ${target}s` }
  }
}

function buildWaves(
  rng: Rng,
  sector: number,
  local: number,
  kind: ObjectiveKind,
  difficulty: number,
  duration: number,
): { waves: MissionWave[]; enemyCount: number; threat: number; priority: number } {
  const roster = rosterFor(sector)
  const isBoss = kind === 'boss'
  const budget = isBoss ? 16 + sector * 5 : 18 + difficulty * 7.5
  const waveCount = isBoss ? 2 : Math.max(3, Math.min(9, 3 + Math.floor(local / 5)))
  const waveCap = 33
  const waves: MissionWave[] = []

  for (let wave = 0; wave < waveCount; wave += 1) {
    const target = Math.min(waveCap, budget / waveCount)
    const entries: WaveEntry[] = []
    let waveThreat = 0
    let guard = 0
    while (waveThreat < target && guard < 8) {
      guard += 1
      const archetype = pick(rng, roster)
      const spec = enemyById(archetype)
      const priority = kind === 'interception' && wave % 2 === 0
      const entry = makeEntry(rng, archetype, intBetween(rng, -34, 34), priority)
      if (waveThreat + spec.threat * entry.count > waveCap) {
        const fit = Math.floor((waveCap - waveThreat) / spec.threat)
        if (fit < 1) continue
        entry.count = fit
      }
      entries.push(entry)
      waveThreat += spec.threat * entry.count
      if (priority) break
    }
    if (entries.length === 0) entries.push({ archetype: roster[0] as string, count: 2, formation: 'line', x: 0 })
    const at = isBoss ? 4 + wave * 8 : 2 + (wave * (duration - 10)) / waveCount
    waves.push({ at: Number(at.toFixed(1)), entries })
  }

  if (kind === 'elite') {
    const last = waves[waves.length - 1] as MissionWave
    last.entries.push({ archetype: 'ace', count: 1, formation: 'line', x: 0 })
  }
  let enemyCount = 0
  let threat = 0
  let priority = 0
  for (const wave of waves) {
    for (const entry of wave.entries) {
      enemyCount += entry.count
      threat += enemyById(entry.archetype).threat * entry.count
      if (entry.priority) priority += entry.count
    }
  }

  return { waves, enemyCount, threat: Number(threat.toFixed(1)), priority }
}

function allowedPowerups(rng: Rng, sector: number, kind: ObjectiveKind): string[] {
  const maxRarity = Math.min(4, 1 + Math.ceil(sector / 3))
  const pool = POWERUPS.filter((powerup) => powerup.rarity <= maxRarity && (kind === 'survive' || powerup.duration > 0 || powerup.rarity <= 2))
  const chosen = shuffle(rng, pool)
    .slice(0, 10)
    .map((powerup) => powerup.id)
  return chosen
}

function missionAt(index: number): MissionDefinition {
  const sector = Math.min(CAMPAIGN.sectors, Math.ceil(index / CAMPAIGN.missionsPerSector))
  const local = ((index - 1) % CAMPAIGN.missionsPerSector) + 1
  const seed = hashSeed(`starfall-squadron-v1:${index}`)
  const rng = mulberry32(seed)
  const tutorial = index <= TUTORIALS.length ? TUTORIALS[index - 1] : undefined
  const kind = tutorial?.kind ?? kindFor(sector, local)
  const boss = kind === 'boss' ? bossForSector(sector) : null
  const difficulty = difficultyOf(sector, local)
  const baseDuration = kind === 'boss' ? 150 : kind === 'survive' ? 55 + sector * 4 : 52 + local + sector * 3
  const duration = Math.min(150, baseDuration)
  const { waves, enemyCount, threat, priority } = buildWaves(rng, sector, local, kind, difficulty, duration)

  const surviveTarget = Math.round(duration * 0.62)
  const killTarget = Math.max(4, Math.round(enemyCount * 0.55))
  const resourceTarget = Math.min(6, 3 + Math.floor(sector / 3))
  const bossName = boss?.name ?? 'the flagship'
  const target =
    kind === 'survive' || kind === 'asteroid' || kind === 'escort' || kind === 'defense'
      ? surviveTarget
      : kind === 'resource'
        ? resourceTarget
        : kind === 'boss'
          ? 1
          : kind === 'interception'
            ? Math.max(1, Math.min(Math.round(2 + sector / 4), priority))
            : kind === 'elite'
              ? Math.max(1, Math.round(sector / 3))
              : kind === 'gauntlet'
                ? enemyCount
                : killTarget

  const objective = objectiveFor(kind, target, enemyCount, bossName)
  const names = OBJECTIVE_NAMES[kind]
  const name = tutorial?.name ?? `${pick(rng, names)}`
  const baseScore = Math.max(600, enemyCount * 55 + (boss ? 2200 : 0))
  const starScore: [number, number, number] = [
    Math.round(baseScore / 100) * 100,
    Math.round((baseScore * 1.55) / 100) * 100,
    Math.round((baseScore * 2.3) / 100) * 100,
  ]

  const hazards: string[] = []
  if (kind === 'asteroid' || sector === 4 || (sector >= 6 && local % 7 === 0)) hazards.push('asteroid')
  if (sector >= 7 && (local % 5 === 0 || kind === 'survive')) hazards.push('gravity')

  return {
    id: `ss-${String(index).padStart(3, '0')}`,
    index,
    sector,
    local,
    seed,
    name,
    type: kind,
    brief: tutorial?.brief ?? BRIEFS[kind],
    objective,
    waves,
    duration,
    difficulty,
    boss: boss?.id ?? null,
    hazards,
    allowedPowerUps: allowedPowerups(rng, sector, kind),
    starScore,
    threat,
    enemyCount,
  }
}

export function generateMission(index: number): MissionDefinition {
  const safe = Math.max(1, Math.min(CAMPAIGN.missions, Math.round(index)))
  return missionAt(safe)
}

let cache: MissionDefinition[] | null = null

export function generateCampaign(): MissionDefinition[] {
  if (cache) return cache
  cache = Array.from({ length: CAMPAIGN.missions }, (_, offset) => missionAt(offset + 1))
  return cache
}

export function missionName(index: number): string {
  return generateMission(index).name
}

/** Endless: one wave per stage, threat climbing with a soft cap. */
export function endlessMission(stage: number, seed = 1): MissionDefinition {
  const index = 1 + ((stage * 7 + seed) % CAMPAIGN.missions)
  const base = generateMission(index)
  const sector = Math.min(10, 1 + Math.floor(stage / 3))
  const threat = Math.min(32, 14 + stage * 2.4)
  const rng = mulberry32(hashSeed(`endless:${stage}:${seed}`))
  const roster = rosterFor(sector)
  const entries: WaveEntry[] = []
  let spent = 0
  let enemyCount = 0
  let guard = 0
  while (spent < threat && entries.length < 6 && guard < 10) {
    guard += 1
    const archetype = pick(rng, roster)
    const entry: WaveEntry = { archetype, count: intBetween(rng, 2, 4), formation: formationFor(rng), x: intBetween(rng, -32, 32) }
    const cost = enemyById(archetype).threat * entry.count
    if (spent + cost > 33) {
      const fit = Math.floor((33 - spent) / enemyById(archetype).threat)
      if (fit < 1) continue
      entry.count = fit
    }
    entries.push(entry)
    spent += enemyById(archetype).threat * entry.count
    enemyCount += entry.count
  }
  return {
    ...base,
    id: `endless-${stage}`,
    index: 9000 + stage,
    sector,
    local: Math.min(30, 1 + (stage % 30)),
    seed: hashSeed(`endless:${stage}:${seed}`),
    name: `Wave ${stage}`,
    type: 'gauntlet',
    brief: 'Endless survival. Each wave is denser than the last.',
    objective: { kind: 'gauntlet', target: enemyCount, label: `Clear wave ${stage}` },
    waves: [{ at: 2.5, entries }],
    duration: 90,
    difficulty: Math.min(10, 2 + stage * 0.35),
    boss: stage % 5 === 0 ? bossForSector(sector).id : null,
    hazards: stage >= 4 ? ['asteroid'] : [],
    starScore: [600, 1200, 2000],
    threat: Number(spent.toFixed(1)),
    enemyCount,
  }
}

export function bossRushMission(round: number): MissionDefinition {
  const sector = Math.max(1, Math.min(10, round))
  const boss = bossForSector(sector)
  const base = generateMission(sector * CAMPAIGN.missionsPerSector)
  return {
    ...base,
    id: `bossrush-${round}`,
    name: boss.name,
    type: 'boss',
    brief: boss.blurb,
    objective: { kind: 'boss', target: 1, label: `Destroy ${boss.name}` },
    boss: boss.id,
    waves: [{ at: 3, entries: [{ archetype: 'interceptor', count: 3, formation: 'v', x: 0 }] }],
    duration: 150,
    difficulty: Math.min(10, 2 + round),
    starScore: [2000, 3600, 5200],
    enemyCount: 3,
    threat: 4.2,
  }
}

export function dailyMission(date: Date): MissionDefinition {
  const key = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
  const seed = hashSeed(`daily:${key}`)
  const index = 1 + (seed % CAMPAIGN.missions)
  const base = generateMission(index)
  return { ...base, id: `daily-${key}`, seed, name: 'Daily Sortie', brief: 'One shared mission per day. Same sky for every pilot.' }
}

export type ChallengeId =
  | 'oneLife'
  | 'noShields'
  | 'basicWeapon'
  | 'missileOnly'
  | 'droneCommander'
  | 'speedClear'
  | 'noDamage'
  | 'survival'
  | 'precision'
  | 'eliteFleet'

export const CHALLENGES: { id: ChallengeId; name: string; blurb: string }[] = [
  { id: 'oneLife', name: 'One Life Only', blurb: 'No respawns. One hull.' },
  { id: 'noShields', name: 'No Shields', blurb: 'Shields are offline for the whole sortie.' },
  { id: 'basicWeapon', name: 'Basic Weapon Only', blurb: 'The pulse cannon, unupgraded.' },
  { id: 'missileOnly', name: 'Missile Specialist', blurb: 'Secondaries only. Make every shot land.' },
  { id: 'droneCommander', name: 'Drone Commander', blurb: 'Two drones, a weak hull.' },
  { id: 'speedClear', name: 'Speed Clear', blurb: 'Everything moves faster.' },
  { id: 'noDamage', name: 'Boss No-Damage', blurb: 'Take a single hit and the sortie ends.' },
  { id: 'survival', name: 'Survival Marathon', blurb: 'Ten waves. One hull. Keep going.' },
  { id: 'precision', name: 'Precision Pilot', blurb: 'Smaller ship, faster bullets.' },
  { id: 'eliteFleet', name: 'Elite Fleet', blurb: 'Aces and cruisers from the first second.' },
]

export function challengeMission(id: ChallengeId, seed = 7): MissionDefinition {
  const base = generateMission(id === 'eliteFleet' ? 300 : id === 'survival' ? 250 : 150)
  return {
    ...base,
    id: `challenge-${id}`,
    seed: hashSeed(`challenge:${id}:${seed}`),
    name: CHALLENGES.find((challenge) => challenge.id === id)?.name ?? 'Challenge',
    brief: CHALLENGES.find((challenge) => challenge.id === id)?.blurb ?? base.brief,
  }
}
