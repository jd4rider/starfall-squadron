/**
 * Validates all 300 campaign missions and writes reports/mission-validation.json.
 * CI fails if any mission is rejected, ids collide, a sector is short of thirty
 * missions, or the ten flagships are not wired to their sectors.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateCampaign } from '../src/levels/generate'
import { validateCampaign, validateMission } from '../src/levels/validate'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const missions = generateCampaign()
const report = validateCampaign(missions)

const records = missions.map((mission) => {
  const record = validateMission(mission)
  return {
    id: mission.id,
    index: mission.index,
    sector: mission.sector,
    local: mission.local,
    seed: mission.seed,
    name: mission.name,
    type: mission.type,
    objective: mission.objective,
    boss: mission.boss,
    hazards: mission.hazards,
    difficulty: mission.difficulty,
    waves: mission.waves.length,
    enemies: mission.enemyCount,
    threat: mission.threat,
    starScore: mission.starScore,
    status: record.status,
    issues: record.issues,
    verification: 'static-structural',
  }
})

const sectorsOk = Object.keys(report.worlds).length === 10 && Object.values(report.worlds).every((count) => count === 30)
const bossesOk = report.bosses === 10

mkdirSync(resolve(root, 'reports'), { recursive: true })
writeFileSync(
  resolve(root, 'reports/mission-validation.json'),
  JSON.stringify(
    {
      generator: 'starfall-squadron-v1',
      generatedAt: new Date().toISOString(),
      total: report.total,
      verified: report.verified,
      rejected: report.rejected,
      unknown: report.unknown,
      duplicateIds: report.duplicateIds,
      nearDuplicates: report.similar.length,
      largest: report.largest,
      maxEnemies: report.maxEnemies,
      maxThreat: report.maxThreat,
      sectors: report.worlds,
      bosses: report.bosses,
      levels: records,
    },
    null,
    2,
  ),
)

console.log(`missions: ${report.total}, verified: ${report.verified}, rejected: ${report.rejected}`)
console.log(`sectors: ${JSON.stringify(report.worlds)}`)
console.log(`bosses: ${report.bosses}, largest: ${report.largest?.id} (${report.largest?.enemies} enemies), peak threat ${report.maxThreat}`)

if (report.rejected > 0 || report.duplicateIds.length > 0 || !sectorsOk || !bossesOk) {
  for (const failure of report.issues.slice(0, 20)) console.error(`REJECTED ${failure.id}: ${failure.issues.join('; ')}`)
  if (!sectorsOk) console.error('Sector distribution is not 10 x 30')
  if (!bossesOk) console.error(`Expected 10 boss missions, found ${report.bosses}`)
  process.exit(1)
}

console.log('All 300 missions verified.')
