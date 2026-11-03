import { describe, expect, it } from 'vitest'
import { generateMission } from '../src/levels/generate'
import {
  buyShip,
  clearedCount,
  createSave,
  isMissionUnlocked,
  loadSave,
  recordMission,
  sectorProgress,
  totalStars,
} from '../src/platform/save'

describe('save system', () => {
  it('creates a clean save with the Falcon and nothing cleared', () => {
    const save = createSave()
    expect(save.ship).toBe('falcon')
    expect(save.ships).toEqual(['falcon'])
    expect(clearedCount(save)).toBe(0)
    expect(totalStars(save)).toBe(0)
    expect(save.progress).toEqual({})
  })

  it('unlocks missions one at a time', () => {
    const save = createSave()
    expect(isMissionUnlocked(save, 1)).toBe(true)
    expect(isMissionUnlocked(save, 2)).toBe(false)
    recordMission(save, generateMission(1), 900, 2, 30)
    expect(isMissionUnlocked(save, 2)).toBe(true)
    expect(isMissionUnlocked(save, 3)).toBe(false)
  })

  it('keeps the best score and star count on replay', () => {
    const save = createSave()
    const mission = generateMission(2)
    recordMission(save, mission, 1500, 3, 100)
    recordMission(save, mission, 800, 1, 20)
    expect(save.progress[2]).toEqual({ stars: 3, score: 1500, cleared: true })
    expect(save.credits).toBe(120)
  })

  it('reports per-sector progress', () => {
    const save = createSave()
    recordMission(save, generateMission(1), 500, 1, 10)
    recordMission(save, generateMission(2), 500, 2, 10)
    expect(sectorProgress(save, 1)).toEqual({ cleared: 2, stars: 3 })
    expect(sectorProgress(save, 2)).toEqual({ cleared: 0, stars: 0 })
  })

  it('only buys a ship when credits are enough', () => {
    const save = createSave()
    expect(buyShip(save, 'viper')).toBe(false)
    save.credits = 1000
    expect(buyShip(save, 'viper')).toBe(true)
    expect(save.credits).toBe(100)
    expect(save.ships).toContain('viper')
    expect(buyShip(save, 'viper')).toBe(false)
  })

  it('falls back to a fresh save when nothing is stored', () => {
    const save = loadSave()
    expect(save.version).toBe(2)
    expect(save.ships).toContain('falcon')
  })
})
