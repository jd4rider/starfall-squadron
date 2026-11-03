import { describe, expect, it } from 'vitest'
import { CAMPAIGN } from '../src/core/constants'
import { dailyMission, endlessMission, generateCampaign, generateMission, bossRushMission } from '../src/levels/generate'
import { validateCampaign, validateMission } from '../src/levels/validate'
import { BOSS_BY_ID } from '../src/content/bosses'

describe('campaign generation', () => {
  const campaign = generateCampaign()

  it('has 300 missions across ten sectors of thirty', () => {
    expect(campaign).toHaveLength(CAMPAIGN.missions)
    const counts = new Map<number, number>()
    for (const mission of campaign) counts.set(mission.sector, (counts.get(mission.sector) ?? 0) + 1)
    expect(counts.size).toBe(10)
    for (const count of counts.values()) expect(count).toBe(30)
  })

  it('uses unique ids and valid local indices', () => {
    const ids = new Set(campaign.map((mission) => mission.id))
    expect(ids.size).toBe(campaign.length)
    for (const mission of campaign) {
      expect(mission.local).toBeGreaterThanOrEqual(1)
      expect(mission.local).toBeLessThanOrEqual(30)
    }
  })

  it('verifies every mission structurally', () => {
    const report = validateCampaign(campaign)
    expect(report.rejected).toBe(0)
    expect(report.duplicateIds).toEqual([])
    expect(report.verified).toBe(campaign.length)
    expect(report.worlds).toEqual({ 1: 30, 2: 30, 3: 30, 4: 30, 5: 30, 6: 30, 7: 30, 8: 30, 9: 30, 10: 30 })
    expect(report.maxEnemies).toBeLessThanOrEqual(70)
  })

  it('ends every sector with its own flagship', () => {
    const bosses = campaign.filter((mission) => mission.objective.kind === 'boss')
    expect(bosses).toHaveLength(10)
    for (const mission of bosses) {
      const boss = BOSS_BY_ID.get(mission.boss ?? '')
      expect(boss?.sector).toBe(mission.sector)
      expect(boss?.phases.length).toBeGreaterThanOrEqual(3)
      expect(mission.local).toBe(30)
    }
  })

  it('opens with curated tutorials', () => {
    expect(campaign[0]?.name).toBe('First Contact')
    expect(campaign[0]?.objective.kind).toBe('eliminate')
    expect(campaign[3]?.objective.kind).toBe('survive')
    expect(campaign[14]?.objective.kind).toBe('elite')
    for (let index = 0; index < 15; index += 1) {
      expect(campaign[index]?.brief.length ?? 0).toBeGreaterThan(30)
    }
  })

  it('generates identical missions for the same index', () => {
    const a = generateMission(137)
    const b = generateMission(137)
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
  })

  it('keeps star thresholds ascending', () => {
    for (const mission of campaign) {
      expect(mission.starScore[0]).toBeLessThan(mission.starScore[1])
      expect(mission.starScore[1]).toBeLessThan(mission.starScore[2])
    }
  })
})

describe('extra modes', () => {
  it('scales endless waves without breaking the entity budget', () => {
    for (let stage = 1; stage <= 25; stage += 1) {
      const mission = endlessMission(stage)
      expect(mission.threat).toBeLessThanOrEqual(33)
      expect(mission.enemyCount).toBeLessThanOrEqual(70)
      expect(validateMission(mission).status).toBe('VERIFIED')
    }
    expect(endlessMission(25).difficulty).toBeGreaterThan(endlessMission(1).difficulty)
  })

  it('builds a boss for every boss rush round', () => {
    for (let round = 1; round <= 10; round += 1) {
      const mission = bossRushMission(round)
      expect(mission.boss).toBe(BOSS_BY_ID.get(mission.boss ?? '')?.id)
      expect(validateMission(mission).status).toBe('VERIFIED')
    }
  })

  it('gives everyone the same daily mission for a date', () => {
    const a = dailyMission(new Date('2026-11-03T12:00:00Z'))
    const b = dailyMission(new Date('2026-11-03T23:59:00Z'))
    expect(a.id).toBe(b.id)
    expect(a.waves).toEqual(b.waves)
  })
})
