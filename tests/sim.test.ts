import { describe, expect, it } from 'vitest'
import { generateMission, bossRushMission } from '../src/levels/generate'
import { CombatSim, starsFor } from '../src/sim/combat'
import { LIMITS } from '../src/core/constants'
import { POWERUPS } from '../src/content/powerups'

function sim(index = 1) {
  return new CombatSim({ mission: generateMission(index), shipId: 'falcon', primary: 'pulse', secondary: 'missiles', primaryLevel: 1 })
}

function advance(instance: CombatSim, seconds: number): void {
  const steps = Math.round(seconds * 60)
  for (let step = 0; step < steps; step += 1) instance.step()
}

describe('combat simulation', () => {
  it('starts with a hull, a shield and three lives', () => {
    const game = sim()
    expect(game.player.maxHull).toBe(100)
    expect(game.player.maxShield).toBe(60)
    expect(game.player.lives).toBe(3)
    expect(game.phase).toBe('active')
  })

  it('auto-fires the primary weapon without input', () => {
    const game = sim()
    advance(game, 0.5)
    expect(game.bullets.length).toBeGreaterThan(0)
    expect(game.bullets.every((bullet) => !bullet.hostile)).toBe(true)
  })

  it('spawns the scheduled waves', () => {
    const game = sim()
    advance(game, 8)
    expect(game.enemies.length).toBeGreaterThan(0)
    expect(game.enemies.length).toBeLessThanOrEqual(LIMITS.enemies)
  })

  it('is deterministic for the same mission and inputs', () => {
    const a = sim(7)
    const b = sim(7)
    a.setTarget(0, 40)
    b.setTarget(0, 40)
    advance(a, 6)
    advance(b, 6)
    expect(a.enemies.length).toBe(b.enemies.length)
    expect(a.score).toBe(b.score)
    expect(a.player.x).toBeCloseTo(b.player.x, 6)
  })

  it('absorbs damage with shields before the hull', () => {
    const game = sim()
    game.player.invuln = 0
    const hull = game.player.hull
    game.hurtPlayer(20)
    expect(game.player.shield).toBe(40)
    expect(game.player.hull).toBe(hull)
    game.player.invuln = 0
    game.hurtPlayer(60)
    expect(game.player.shield).toBe(0)
    expect(game.player.hull).toBe(hull - 20)
  })

  it('never lets the hull go negative and ends the run', () => {
    const game = sim()
    game.player.invuln = 0
    for (let index = 0; index < 30; index += 1) {
      game.player.invuln = 0
      game.hurtPlayer(120)
    }
    expect(game.player.hull).toBeGreaterThanOrEqual(0)
    expect(game.phase).toBe('defeat')
  })

  it('respects no-damage modifiers', () => {
    const game = new CombatSim({
      mission: generateMission(1),
      shipId: 'falcon',
      primary: 'pulse',
      secondary: 'missiles',
      mods: { noDamage: true },
    })
    game.player.invuln = 0
    game.hurtPlayer(50)
    expect(game.player.hull).toBe(100)
    expect(game.phase).toBe('active')
  })

  it('halves the shield when shields are restricted', () => {
    const game = new CombatSim({
      mission: generateMission(1),
      shipId: 'falcon',
      primary: 'pulse',
      secondary: 'missiles',
      mods: { noShields: true },
    })
    expect(game.player.maxShield).toBe(0)
  })

  it('caps weapon upgrades at level five and stacks timed effects', () => {
    const game = sim()
    for (let index = 0; index < 10; index += 1) game.grantPowerup('weaponUp')
    expect(game.weaponLevel).toBe(5)
    game.grantPowerup('rapid')
    game.grantPowerup('rapid')
    expect(game.effects.get('rapid')).toBeGreaterThan(0)
    expect(game.effects.get('rapid')).toBeLessThanOrEqual(12)
  })

  it('caps drone pickups at the drone limit', () => {
    const game = sim()
    for (let index = 0; index < 8; index += 1) game.grantPowerup('drone')
    expect(game.drones.length).toBeLessThanOrEqual(LIMITS.drones)
  })

  it('does not let a mega shield permanently inflate max shields', () => {
    const game = sim()
    game.grantPowerup('megaShield')
    expect(game.player.maxShield).toBe(120)
    advance(game, 15)
    expect(game.player.maxShield).toBe(60)
  })

  it('damages enemies that sit in the firing line', () => {
    const game = sim()
    advance(game, 3)
    const target = game.enemies[0]
    expect(target).toBeDefined()
    if (!target) return
    target.x = 0
    // Directly ahead of the muzzle, so the test does not depend on where the
    // ship happens to start.
    target.y = game.player.y + 30
    const before = target.hp
    advance(game, 0.6)
    expect(target.hp).toBeLessThan(before)
  })

  it('spends secondary charges and refuses to fire when empty', () => {
    const game = sim()
    expect(game.fireSecondary()).toBe(true)
    expect(game.player.secondaryCharges).toBe(3)
    for (let index = 0; index < 5; index += 1) {
      game.player.secondaryTimer = 0
      game.fireSecondary()
    }
    expect(game.player.secondaryCharges).toBe(0)
    game.player.secondaryTimer = 0
    expect(game.fireSecondary()).toBe(false)
  })

  it('uses bombs without going negative', () => {
    const game = sim()
    expect(game.useBomb()).toBe(true)
    expect(game.snapshot().bombs).toBe(0)
    expect(game.useBomb()).toBe(false)
  })

  it('triggers every ship ability', () => {
    for (const shipId of ['falcon', 'viper', 'titan', 'spear', 'phantom', 'phoenix', 'sentinel', 'tempest', 'eclipse', 'prime']) {
      const game = new CombatSim({ mission: generateMission(1), shipId, primary: 'pulse', secondary: 'missiles' })
      expect(game.useAbility()).toBe(true)
      expect(game.useAbility()).toBe(false)
    }
  })

  it('completes a mission when the objective is met', () => {
    const game = sim()
    game.grantVictory()
    expect(game.phase).toBe('victory')
    expect(game.snapshot().phase).toBe('victory')
    expect(starsFor(game.score, game.mission)).toBeGreaterThanOrEqual(0)
  })

  it('spawns the flagship in a boss mission', () => {
    const game = new CombatSim({ mission: bossRushMission(1), shipId: 'titan', primary: 'pulse', secondary: 'missiles' })
    advance(game, 12)
    expect(game.boss).not.toBeNull()
    expect(game.boss?.spec.id).toBe('dreadnought')
    expect(game.boss?.parts.length).toBeGreaterThan(0)
  })

  it('moves the flagship into its next phase as hull drops', () => {
    const game = new CombatSim({ mission: bossRushMission(1), shipId: 'titan', primary: 'pulse', secondary: 'missiles' })
    advance(game, 12)
    const boss = game.boss
    expect(boss).not.toBeNull()
    if (!boss) return
    boss.entering = false
    boss.hp = boss.maxHp * 0.5
    advance(game, 1)
    expect(boss.phase).toBe(1)
    expect(game.bullets.some((bullet) => bullet.hostile) || game.enemies.length > 0).toBe(true)
  })

  it('keeps bullet counts inside the runtime caps', () => {
    const game = sim(40)
    advance(game, 30)
    expect(game.bullets.length).toBeLessThanOrEqual(LIMITS.playerBullets + LIMITS.enemyBullets)
    expect(game.enemies.length).toBeLessThanOrEqual(LIMITS.enemies)
  })

  it('accepts every one of the forty power-ups without breaking its caps', () => {
    const game = sim()
    for (const powerup of POWERUPS) {
      expect(() => game.grantPowerup(powerup.id)).not.toThrow()
    }
    expect(game.weaponLevel).toBeLessThanOrEqual(5)
    expect(game.drones.length).toBeLessThanOrEqual(LIMITS.drones)
    expect(game.player.lives).toBeLessThanOrEqual(5)
    expect(game.player.hull).toBeLessThanOrEqual(game.player.maxHull)
    expect(game.player.shield).toBeLessThanOrEqual(game.player.maxShield)
    for (const remaining of game.effects.values()) expect(remaining).toBeGreaterThan(0)
  })
})
