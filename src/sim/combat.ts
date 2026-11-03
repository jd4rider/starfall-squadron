/**
 * Starfall Squadron combat simulation.
 *
 * Pure TypeScript, no Three.js. Fixed 1/60s steps, seeded drops, and a single
 * authoritative state that the renderer only reads. Everything that decides
 * whether you live or die happens here.
 */
import { FIELD, LIMITS, PLAYER, SIM_STEP } from '../core/constants'
import { hashSeed, mulberry32, weighted, type Rng } from '../core/rng'
import type { MissionDefinition, MissionObjective } from '../core/types'
import { enemyById, type Behavior, type EnemySpec } from '../content/enemies'
import { bossById, type BossPattern, type BossSpec } from '../content/bosses'
import { POWERUP_BY_ID, DROP_WEIGHTS, type EffectId } from '../content/powerups'
import { secondaryById, weaponById, weaponLevel, type WeaponLevel } from '../content/weapons'
import { shipById, type ShipSpec } from '../content/ships'

export type Phase = 'active' | 'victory' | 'defeat'

export interface RunModifiers {
  oneLife?: boolean
  noShields?: boolean
  basicWeapon?: boolean
  missileOnly?: boolean
  noDamage?: boolean
  noPowerups?: boolean
  speed?: number
  drones?: number
  eliteFleet?: boolean
}

export interface RunOptions {
  mission: MissionDefinition
  shipId: string
  primary: string
  secondary: string
  primaryLevel?: number
  mods?: RunModifiers
}

export interface Bullet {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  damage: number
  hostile: boolean
  life: number
  pierce: number
  color: string
  kind: 'bolt' | 'orb' | 'wave' | 'missile' | 'mine'
  chain: boolean
  explosive: number
  crit: boolean
  trail: boolean
}

export interface Enemy {
  id: number
  spec: EnemySpec
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  hp: number
  maxHp: number
  r: number
  fireTimer: number
  path: number
  stun: number
  priority: boolean
  shielded: number
  flash: number
  drift: number
}

export interface Pickup {
  id: number
  x: number
  y: number
  vy: number
  effect: EffectId
  resource: boolean
  ttl: number
}

export interface Asteroid {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  hp: number
  spin: number
}

export interface BossPart {
  x: number
  y: number
  hp: number
  maxHp: number
  fireTimer: number
  alive: boolean
}

export interface Boss {
  spec: BossSpec
  x: number
  y: number
  hp: number
  maxHp: number
  phase: number
  fireTimer: number
  patternIndex: number
  parts: BossPart[]
  flash: number
  spiral: number
  direction: number
  entering: boolean
  blink: number
  alive: boolean
}

export interface Beam {
  x: number
  width: number
  warm: number
  life: number
  damage: number
  hostile: boolean
}

export interface Station {
  x: number
  y: number
  hp: number
  maxHp: number
  kind: 'courier' | 'relay'
  angle: number
}

export interface Drone {
  x: number
  y: number
  fireTimer: number
  offset: number
}

export interface SimEvent {
  type: 'explode' | 'hit' | 'pickup' | 'shot' | 'boss' | 'arc' | 'beam' | 'death' | 'win' | 'lose' | 'phase'
  x: number
  y: number
  size?: number
  color?: string
  x2?: number
  y2?: number
}

export interface Snapshot {
  phase: Phase
  score: number
  hull: number
  maxHull: number
  shield: number
  maxShield: number
  lives: number
  weapon: string
  weaponLevel: number
  secondary: string
  secondaryCharges: number
  abilityReady: number
  bombs: number
  drones: number
  combo: number
  kills: number
  time: number
  progress: number
  progressTarget: number
  objective: MissionObjective
  boss: { name: string; hp: number; maxHp: number; phase: number; parts: number } | null
  effects: { id: EffectId; name: string; glyph: string; remaining: number }[]
  station: { hp: number; maxHp: number; kind: 'courier' | 'relay' } | null
  lowHull: boolean
}

interface Charges {
  bombs: number
  barrage: number
}

const clamp = (value: number, min: number, max: number): number => (value < min ? min : value > max ? max : value)
const TAU = Math.PI * 2

export function starsFor(score: number, mission: MissionDefinition): number {
  if (score >= mission.starScore[2]) return 3
  if (score >= mission.starScore[1]) return 2
  return score >= mission.starScore[0] ? 1 : 0
}

export class CombatSim {
  readonly mission: MissionDefinition
  readonly ship: ShipSpec
  readonly mods: RunModifiers
  readonly primary: string
  readonly secondary: string
  readonly rng: Rng

  phase: Phase = 'active'
  time = 0
  score = 0
  kills = 0
  eliteKills = 0
  priorityKilled = 0
  priorityEscaped = 0
  resources = 0
  credits = 0
  combo = 0
  damageTaken = 0
  shotsFired = 0
  shotsHit = 0

  player = {
    x: 0,
    y: 30,
    targetX: 0,
    targetY: 30,
    vx: 0,
    vy: 0,
    hull: 100,
    maxHull: 100,
    shield: 60,
    maxShield: 60,
    invuln: 1.2,
    fireTimer: 0,
    secondaryTimer: 0,
    secondaryCharges: 4,
    abilityCooldown: 0,
    jam: 0,
    lives: PLAYER.lives,
  }

  weaponId: string
  weaponLevel: number
  bullets: Bullet[] = []
  enemies: Enemy[] = []
  pickups: Pickup[] = []
  asteroids: Asteroid[] = []
  beams: Beam[] = []
  boss: Boss | null = null
  station: Station | null = null
  drones: Drone[] = []
  effects = new Map<EffectId, number>()
  charges: Charges = { bombs: 1, barrage: 0 }
  events: SimEvent[] = []

  private nextId = 1
  private nextWave = 0
  private bossSpawned = false
  private bossDefeated = false
  private comboTimer = 0
  private missileTimer = 0
  private resourceTimer = 3
  private asteroidTimer = 2
  private shieldRegenDelay = 0

  constructor(options: RunOptions) {
    this.mission = options.mission
    this.ship = shipById(options.shipId)
    this.mods = options.mods ?? {}
    this.primary = options.mods?.basicWeapon ? 'pulse' : options.primary
    this.secondary = options.secondary
    this.weaponId = this.primary
    this.weaponLevel = clamp(options.primaryLevel ?? 1, 1, 5)
    this.rng = mulberry32(hashSeed(`sim:${options.mission.id}:${options.mission.seed}`))
    this.resetPlayer(true)
  }

  // ------------------------------------------------------------------ lifecycle

  private resetPlayer(fresh: boolean): void {
    const ship = this.ship
    const shieldScale = this.mods.noShields ? 0 : 1
    this.player.maxHull = ship.hull
    this.player.hull = ship.hull
    this.player.maxShield = Math.round(ship.shield * shieldScale)
    this.player.shield = this.player.maxShield
    this.player.x = 0
    this.player.y = 32
    this.player.targetX = 0
    this.player.targetY = 32
    this.player.vx = 0
    this.player.vy = 0
    this.player.invuln = fresh ? 1.4 : PLAYER.respawnInvuln
    this.player.jam = 0
    this.player.fireTimer = 0.2
    this.player.abilityCooldown = 0
    this.player.secondaryCharges = secondaryById(this.secondary).charges
    this.drones = []
    const slots = Math.min(LIMITS.drones, ship.drones + (this.mods.drones ?? 0))
    for (let index = 0; index < slots; index += 1) {
      this.drones.push({ x: 0, y: 26, fireTimer: 0.4, offset: index === 0 ? -7 : 7 })
    }
    if (!fresh) this.player.lives = Math.max(0, this.player.lives - 1)
  }

  setTarget(x: number, y: number): void {
    this.player.targetX = clamp(x, -FIELD.halfWidth + 3, FIELD.halfWidth - 3)
    this.player.targetY = clamp(y, FIELD.playerMinY, FIELD.playerMaxY)
  }

  /** Debug/test helper: finish the mission immediately. */
  grantVictory(): void {
    if (this.phase !== 'active') return
    this.complete()
  }

  grantPowerup(id: EffectId): void {
    this.applyPowerup(id)
  }

  // ---------------------------------------------------------------------- step

  step(dt = SIM_STEP): void {
    if (this.phase !== 'active') return
    const scale = this.mods.speed ?? 1
    const step = dt * scale
    this.time += step
    this.tickEffects(step)
    this.updatePlayer(step)
    this.spawnWaves()
    this.updateEnemies(step)
    this.updateBoss(step)
    this.updateAsteroids(step)
    this.updateBullets(step)
    this.updateBeams(step)
    this.updatePickups(step)
    this.updateStation(step)
    this.shieldRegenDelay = Math.max(0, this.shieldRegenDelay - step)
    this.regen(step)
    this.checkObjective()
    this.cleanup()
  }

  private tickEffects(dt: number): void {
    for (const [id, remaining] of this.effects) {
      const next = remaining - dt
      if (next <= 0) this.effects.delete(id)
      else this.effects.set(id, next)
    }
    this.comboTimer = Math.max(0, this.comboTimer - dt)
    if (this.comboTimer === 0) this.combo = 0
    this.player.secondaryTimer = Math.max(0, this.player.secondaryTimer - dt)
    this.player.abilityCooldown = Math.max(0, this.player.abilityCooldown - dt)
    this.player.jam = Math.max(0, this.player.jam - dt)
    if (this.charges.barrage > 0) {
      this.charges.barrage -= dt
      this.missileTimer -= dt
      if (this.missileTimer <= 0) {
        this.missileTimer = 0.12
        this.fireMissiles(2)
      }
    }
  }

  private active(id: EffectId): boolean {
    return (this.effects.get(id) ?? 0) > 0
  }

  private regen(dt: number): void {
    if (this.player.shield < this.player.maxShield && this.shieldRegenDelay <= 0) {
      this.player.shield = Math.min(this.player.maxShield, this.player.shield + this.ship.shieldRegen * dt)
    }
    if (this.active('repairDrone')) this.player.hull = Math.min(this.player.maxHull, this.player.hull + 2.5 * dt)
  }

  private updatePlayer(dt: number): void {
    const player = this.player
    const speed = this.ship.speed * (this.active('speedBoost') ? 1.35 : 1) * (this.mods.speed ?? 1) * 0.85
    const accel = this.ship.accel * (this.active('speedBoost') ? 1.3 : 1)
    const dx = player.targetX - player.x
    const dy = player.targetY - player.y
    player.vx = clamp(player.vx + clamp(dx * 9, -accel, accel) * dt, -speed * 2.4, speed * 2.4)
    player.vy = clamp(player.vy + clamp(dy * 9, -accel, accel) * dt, -speed * 2.4, speed * 2.4)
    const drag = Math.max(0, 1 - 7 * dt)
    player.vx *= drag
    player.vy *= drag
    player.x = clamp(player.x + player.vx * dt, -FIELD.halfWidth + 3, FIELD.halfWidth - 3)
    player.y = clamp(player.y + player.vy * dt, FIELD.playerMinY, FIELD.playerMaxY)
    player.invuln = Math.max(0, player.invuln - dt)

    // Gravity hazards and disruptors pull the ship upward.
    if (this.mission.hazards.includes('gravity') && player.y > 50 && !this.active('invuln')) {
      player.vy -= 1.6 * dt
    }
    for (const enemy of this.enemies) {
      if (enemy.spec.behavior === 'gravity' && enemy.y < 150 && Math.abs(enemy.x - player.x) < 26) {
        player.vx += Math.sign(enemy.x - player.x) * 6 * dt
      }
    }

    player.fireTimer -= dt
    if (player.fireTimer <= 0 && player.jam <= 0) this.fireWeapon()

    this.fireDrones(dt)
    this.missileTimer -= dt
    if (this.active('missiles') && this.missileTimer <= 0) {
      this.missileTimer = 1.1
      this.fireMissiles(2)
    }
  }

  private fireDrones(dt: number): void {
    const rate = this.active('droneUpgrade') ? 0.32 : 0.55
    for (const drone of this.drones) {
      drone.x = this.player.x + drone.offset
      drone.y = this.player.y + 6
      drone.fireTimer -= dt
      if (drone.fireTimer <= 0) {
        drone.fireTimer = rate
        this.spawnBullet(drone.x, drone.y + 2, 0, 150, 1.6, '#93c5fd', false, { r: 0.55 })
      }
    }
  }

  private fireWeapon(): void {
    if (this.mods.missileOnly) {
      this.player.fireTimer = 0.5
      this.fireMissiles(1)
      return
    }
    const spec = weaponById(this.weaponId)
    const level = weaponLevel(spec, this.weaponLevel)
    const damageMul =
      this.ship.damage * (this.active('overdrive') ? 1.6 : 1) * (this.active('damageBoost') ? 1.3 : 1) * (this.active('laserUp') && spec.id === 'beam' ? 1.3 : 1)
    const shots = level.shots + (this.active('double') ? 1 : 0) + (this.active('triple') ? 1 : 0)
    const spread = level.spread + (this.active('spread') ? 9 : 0)
    const rate = level.cooldown * (this.active('rapid') ? 0.6 : 1) * (this.active('overdrive') ? 0.65 : 1) / this.ship.fireRate
    this.player.fireTimer = Math.max(0.028, rate)
    this.shotsFired += shots

    for (let index = 0; index < shots; index += 1) {
      const fraction = shots === 1 ? 0 : index / (shots - 1) - 0.5
      const angle = (fraction * spread * Math.PI) / 180
      const muzzle = 3.4
      this.spawnBullet(
        this.player.x + Math.sin(angle) * muzzle,
        this.player.y + Math.cos(angle) * muzzle,
        Math.sin(angle) * level.speed,
        Math.cos(angle) * level.speed,
        level.damage * damageMul,
        spec.color,
        false,
        {
          r: level.radius,
          pierce: level.pierce + (this.active('pierce') ? 2 : 0),
          kind: spec.kind === 'wave' ? 'wave' : spec.kind === 'spread' || spec.kind === 'fusion' ? 'orb' : 'bolt',
          explosive: (spec.special === 'aoe' ? 7 : 0) + (this.active('explosive') ? 6 : 0),
          chain: spec.special === 'chain' || this.active('chain'),
        },
      )
    }
    this.events.push({ type: 'shot', x: this.player.x, y: this.player.y + 4, color: spec.color })
  }

  private spawnBullet(
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    color: string,
    hostile: boolean,
    extra: Partial<Bullet> = {},
  ): void {
    const cap = hostile ? LIMITS.enemyBullets : LIMITS.playerBullets
    if (this.bullets.length >= cap) return
    this.bullets.push({
      id: this.nextId++,
      x,
      y,
      vx,
      vy,
      r: 0.9,
      damage,
      hostile,
      life: 3,
      pierce: 0,
      color,
      kind: 'bolt',
      chain: false,
      explosive: 0,
      crit: false,
      trail: !hostile,
      ...extra,
    })
  }

  private fireMissiles(count: number): void {
    for (let index = 0; index < count; index += 1) {
      const target = this.nearestEnemy(this.player.x + (index - count / 2) * 5, this.player.y)
      const angle = target ? Math.atan2(target.y - this.player.y, target.x - this.player.x) : Math.PI / 2
      this.spawnBullet(
        this.player.x + (index - count / 2) * 2,
        this.player.y,
        Math.cos(angle) * 70,
        Math.sin(angle) * 70 + 30,
        9 * this.ship.damage,
        '#fdba74',
        false,
        { kind: 'missile', r: 1.1, trail: true, explosive: 5, life: 4 },
      )
    }
  }

  // ------------------------------------------------------------------- spawning

  private spawnWaves(): void {
    while (this.nextWave < this.mission.waves.length) {
      const wave = this.mission.waves[this.nextWave]
      if (!wave || this.time < wave.at) break
      this.nextWave += 1
      for (const entry of wave.entries) {
        const offsets = this.formation(entry.formation, entry.count, entry.x)
        for (const offset of offsets) {
          if (this.enemies.length >= LIMITS.enemies) break
          this.spawnEnemy(entry.archetype, offset.x, FIELD.spawnY + offset.y, Boolean(entry.priority))
        }
      }
    }
  }

  private formation(formation: string, count: number, anchorX: number): { x: number; y: number }[] {
    const gap = 9
    const out: { x: number; y: number }[] = []
    for (let index = 0; index < count; index += 1) {
      const centered = index - (count - 1) / 2
      switch (formation) {
        case 'v':
          out.push({ x: anchorX + centered * gap, y: -Math.abs(centered) * 6 })
          break
        case 'line':
          out.push({ x: anchorX + centered * gap, y: 0 })
          break
        case 'diamond': {
          const row = Math.abs(centered) > 1 ? 1 : 0
          out.push({ x: anchorX + centered * gap * 0.8, y: row * 8 })
          break
        }
        case 'wedge':
          out.push({ x: anchorX + centered * gap * 0.7, y: Math.abs(centered) * 5 })
          break
        case 'spiral': {
          const angle = (index / count) * TAU
          out.push({ x: anchorX + Math.cos(angle) * gap * 1.4, y: Math.sin(angle) * 7 })
          break
        }
        case 'pincer':
          out.push({ x: anchorX + Math.sign(centered || 1) * (gap + Math.abs(centered) * 2), y: (index % 2) * 6 })
          break
        case 'swarm':
          out.push({ x: anchorX + (this.rng() - 0.5) * gap * count, y: (this.rng() - 0.5) * 12 })
          break
        case 'stagger':
          out.push({ x: anchorX + centered * gap, y: (index % 2) * 7 })
          break
        case 'escort':
          out.push({ x: anchorX + centered * gap * 1.3, y: Math.abs(centered) * 4 })
          break
        default:
          out.push({ x: anchorX + centered * gap, y: 0 })
      }
    }
    return out.map((entry) => ({ x: clamp(entry.x, -FIELD.halfWidth + 5, FIELD.halfWidth - 5), y: entry.y }))
  }

  private spawnEnemy(archetype: string, x: number, y: number, priority: boolean): void {
    const spec = enemyById(archetype)
    const hpScale = 1 + this.mission.difficulty * 0.09
    this.enemies.push({
      id: this.nextId++,
      spec,
      x,
      y,
      vx: 0,
      vy: 0,
      baseX: x,
      hp: spec.hull * hpScale,
      maxHp: spec.hull * hpScale,
      r: spec.radius,
      fireTimer: 0.6 + this.rng() * spec.fireCooldown,
      path: this.rng() * TAU,
      stun: 0,
      priority,
      shielded: 0,
      flash: 0,
      drift: (this.rng() - 0.5) * 14,
    })
  }

  // -------------------------------------------------------------------- enemies

  private updateEnemies(dt: number): void {
    const slow = this.active('timeSlow') ? 0.45 : 1
    const speedScale = slow * (this.mods.speed ?? 1)
    for (const enemy of this.enemies) {
      const spec = enemy.spec
      enemy.flash = Math.max(0, enemy.flash - dt * 3)
      enemy.path += dt * 1.6
      if (enemy.stun > 0) {
        enemy.stun -= dt
        enemy.y -= spec.speed * 0.18 * dt
        continue
      }
      const speed = spec.speed * speedScale
      const towardPlayer = Math.sign(this.player.x - enemy.x)
      switch (spec.behavior) {
        case 'advance':
          enemy.y -= speed * dt
          enemy.x += Math.sin(enemy.path * 0.7) * 5 * dt + enemy.drift * dt * 0.2
          break
        case 'sine':
          enemy.y -= speed * dt
          enemy.x = clamp(enemy.baseX + Math.sin(enemy.path) * 11, -FIELD.halfWidth + 4, FIELD.halfWidth - 4)
          break
        case 'dive':
          enemy.vy = Math.min(70, (enemy.vy || speed * 0.4) + 60 * dt)
          enemy.y -= enemy.vy * dt
          enemy.x += towardPlayer * 16 * dt
          break
        case 'strafe':
        case 'ace':
          enemy.y = Math.max(112, enemy.y - speed * dt)
          enemy.x += Math.sin(enemy.path * 1.4) * speed * 0.7 * dt
          break
        case 'hover':
        case 'artillery':
          enemy.y = Math.max(128, enemy.y - speed * dt)
          enemy.x = clamp(enemy.baseX + Math.sin(enemy.path * 0.8) * 8, -FIELD.halfWidth + 4, FIELD.halfWidth - 4)
          break
        case 'turret':
        case 'sniper':
        case 'shield':
        case 'repair':
        case 'carrier':
          enemy.y = Math.max(132, enemy.y - speed * 0.8 * dt)
          enemy.x = enemy.baseX + Math.sin(enemy.path * 0.5) * 6
          break
        case 'kamikaze': {
          const dx = this.player.x - enemy.x
          const dy = this.player.y - enemy.y
          const length = Math.max(1, Math.hypot(dx, dy))
          enemy.x += (dx / length) * speed * dt
          enemy.y += (dy / length) * speed * dt
          break
        }
        case 'minelayer':
          enemy.y -= speed * 0.5 * dt
          enemy.x += Math.sin(enemy.path * 0.45) * 9 * dt
          break
        case 'teleport':
          enemy.y -= speed * 0.6 * dt
          if (Math.floor(enemy.path) % 5 === 0) {
            enemy.x = clamp(enemy.baseX + Math.sin(enemy.path * 3) * 20, -FIELD.halfWidth + 4, FIELD.halfWidth - 4)
          }
          break
        case 'leech': {
          const dx = this.player.x - enemy.x
          const dy = this.player.y - enemy.y
          const length = Math.max(1, Math.hypot(dx, dy))
          enemy.x += (dx / length) * speed * 0.7 * dt
          enemy.y += (dy / length) * speed * 0.7 * dt
          break
        }
        case 'emp':
        case 'gravity':
          enemy.y = Math.max(140, enemy.y - speed * 0.6 * dt)
          enemy.x = enemy.baseX
          break
      }
      enemy.x = clamp(enemy.x, -FIELD.halfWidth + 3, FIELD.halfWidth - 3)

      enemy.fireTimer -= dt
      if (enemy.fireTimer <= 0 && enemy.y < FIELD.height + 4 && enemy.y > 16) {
        this.enemyFire(enemy)
        enemy.fireTimer = spec.fireCooldown * (0.85 + this.rng() * 0.3)
      }

      if (enemy.shielded > 0) enemy.shielded -= dt

      if (enemy.y < FIELD.despawnY) {
        if (enemy.priority) this.priorityEscaped += 1
        enemy.hp = 0
      }
    }
    this.enemies = this.enemies.filter((enemy) => enemy.hp > 0 && enemy.y > FIELD.despawnY)
  }

  private enemyFire(enemy: Enemy): void {
    const spec = enemy.spec
    const damage = spec.bulletDamage * (1 + this.mission.difficulty * 0.05)
    const aim = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x)
    switch (spec.behavior) {
      case 'sniper':
        this.spawnBullet(enemy.x, enemy.y, Math.cos(aim) * 96, Math.sin(aim) * 96, damage * 1.4, '#fbcfe8', true, { kind: 'orb', r: 1.2, life: 2.4 })
        break
      case 'artillery':
        this.spawnBullet(enemy.x, enemy.y, Math.cos(aim) * 40, Math.sin(aim) * 40, damage * 1.5, '#fb923c', true, { kind: 'orb', r: 2.2, life: 5 })
        break
      case 'turret':
        for (let index = -1; index <= 1; index += 1) {
          const angle = aim + index * 0.18
          this.spawnBullet(enemy.x, enemy.y, Math.cos(angle) * 62, Math.sin(angle) * 62, damage * 0.8, '#fca5a5', true)
        }
        break
      case 'minelayer':
        this.spawnBullet(enemy.x, enemy.y - 4, 0, -8, damage, '#fcd34d', true, { kind: 'mine', r: 2.6, life: 9 })
        break
      case 'carrier': {
        if (this.enemies.length < LIMITS.enemies - 2) {
          this.spawnEnemy('scout', enemy.x + 6, enemy.y - 6, false)
          this.spawnEnemy('scout', enemy.x - 6, enemy.y - 6, false)
        }
        break
      }
      case 'shield': {
        for (const ally of this.enemies) {
          if (ally !== enemy && Math.hypot(ally.x - enemy.x, ally.y - enemy.y) < 26) ally.shielded = 3
        }
        break
      }
      case 'repair': {
        for (const ally of this.enemies) {
          if (ally !== enemy && ally.hp < ally.maxHp && Math.hypot(ally.x - enemy.x, ally.y - enemy.y) < 26) {
            ally.hp = Math.min(ally.maxHp, ally.hp + ally.maxHp * 0.25)
          }
        }
        break
      }
      case 'emp':
        this.player.jam = Math.max(this.player.jam, 1.5)
        this.events.push({ type: 'beam', x: enemy.x, y: enemy.y, color: '#c4b5fd' })
        break
      case 'gravity':
        this.player.vx += Math.sign(enemy.x - this.player.x) * 12
        break
      case 'ace':
        for (let index = 0; index < 3; index += 1) {
          const angle = aim + (index - 1) * 0.14
          this.spawnBullet(enemy.x, enemy.y, Math.cos(angle) * 78, Math.sin(angle) * 78, damage, '#f9a8d4', true, { kind: 'bolt' })
        }
        break
      case 'kamikaze':
        break
      default:
        this.spawnBullet(enemy.x, enemy.y - enemy.r, Math.cos(aim) * 58, Math.sin(aim) * 58, damage, spec.accent, true, { r: 0.9 })
    }
  }

  // ----------------------------------------------------------------------- boss

  private spawnBoss(): void {
    if (this.bossSpawned || !this.mission.boss) return
    const spec = bossById(this.mission.boss)
    if (!spec) return
    this.bossSpawned = true
    const parts: BossPart[] = []
    for (let index = 0; index < spec.turrets; index += 1) {
      const angle = (index / spec.turrets) * TAU
      parts.push({
        x: Math.cos(angle) * spec.radius * 0.9,
        y: Math.sin(angle) * spec.radius * 0.55,
        hp: spec.turretHp,
        maxHp: spec.turretHp,
        fireTimer: 1 + index * 0.2,
        alive: true,
      })
    }
    const hpScale = this.mods.eliteFleet ? 1.2 : 1
    this.boss = {
      spec,
      x: 0,
      y: FIELD.height + 40,
      hp: spec.hp * hpScale,
      maxHp: spec.hp * hpScale,
      phase: 0,
      fireTimer: 2.2,
      patternIndex: 0,
      parts,
      flash: 0,
      spiral: 0,
      direction: 1,
      entering: true,
      blink: 0,
      alive: true,
    }
    this.events.push({ type: 'boss', x: 0, y: 140, size: spec.radius })
  }

  private updateBoss(dt: number): void {
    if (this.mission.boss && !this.bossSpawned) {
      const lastWave = this.mission.waves[this.mission.waves.length - 1]
      if (this.time > (lastWave ? lastWave.at + 8 : 8)) this.spawnBoss()
    }
    const boss = this.boss
    if (!boss || !boss.alive) return
    boss.flash = Math.max(0, boss.flash - dt * 2.4)
    boss.blink = Math.max(0, boss.blink - dt)
    if (boss.entering) {
      boss.y -= 34 * dt
      if (boss.y <= 142) {
        boss.y = 142
        boss.entering = false
      }
      return
    }
    boss.x = Math.sin(this.time * 0.55) * 24
    const phaseIndex = boss.hp / boss.maxHp > 0.66 ? 0 : boss.hp / boss.maxHp > 0.33 ? 1 : 2
    if (phaseIndex !== boss.phase) {
      boss.phase = phaseIndex
      boss.fireTimer = 1.4
      this.enemies = this.enemies.filter((enemy) => enemy.y > 20)
      this.bullets = this.bullets.filter((bullet) => !bullet.hostile)
      this.events.push({ type: 'phase', x: boss.x, y: boss.y })
    }
    const phase = boss.spec.phases[Math.min(boss.phase, boss.spec.phases.length - 1)]!
    boss.fireTimer -= dt
    if (boss.fireTimer <= 0) {
      const pattern = phase.patterns[boss.patternIndex % phase.patterns.length] as BossPattern
      boss.patternIndex += 1
      this.bossPattern(boss, pattern, phase.bulletSpeed)
      boss.fireTimer = phase.fireCooldown * (0.9 + this.rng() * 0.2)
    }

    for (const part of boss.parts) {
      if (!part.alive) continue
      part.fireTimer -= dt
      if (part.fireTimer <= 0) {
        part.fireTimer = 2.2 + this.rng() * 0.6
        const x = boss.x + part.x
        const y = boss.y + part.y
        const aim = Math.atan2(this.player.y - y, this.player.x - x)
        this.spawnBullet(x, y, Math.cos(aim) * 54, Math.sin(aim) * 54, 8, boss.spec.accent, true, { r: 1.1 })
      }
    }

  }

  private bossPattern(boss: Boss, pattern: BossPattern, speed: number): void {
    const aim = Math.atan2(this.player.y - boss.y, this.player.x - boss.x)
    switch (pattern) {
      case 'radial': {
        const count = 14
        for (let index = 0; index < count; index += 1) {
          const angle = (index / count) * TAU + this.rng() * 0.1
          this.spawnBullet(boss.x, boss.y, Math.cos(angle) * speed * 0.7, Math.sin(angle) * speed * 0.7, 9, boss.spec.accent, true, { kind: 'orb', r: 1.3 })
        }
        break
      }
      case 'aimed':
        for (let index = -2; index <= 2; index += 1) {
          const angle = aim + index * 0.11
          this.spawnBullet(boss.x, boss.y - 4, Math.cos(angle) * speed, Math.sin(angle) * speed, 9, boss.spec.accent, true, { r: 1.1 })
        }
        break
      case 'sweep':
        for (let index = 0; index < 6; index += 1) {
          const angle = Math.PI / 2 + (index - 2.5) * 0.16
          this.spawnBullet(boss.x, boss.y - 6, Math.cos(angle) * speed * 0.9, Math.sin(angle) * speed * 0.9, 8, '#fca5a5', true, { r: 1.2 })
        }
        break
      case 'spiral':
        boss.spiral += 0.5
        for (let index = 0; index < 4; index += 1) {
          const angle = boss.spiral + (index * TAU) / 4
          this.spawnBullet(boss.x, boss.y, Math.cos(angle) * speed * 0.75, Math.sin(angle) * speed * 0.75, 8, boss.spec.accent, true, { kind: 'orb', r: 1.2 })
        }
        break
      case 'minions':
        if (this.enemies.length < LIMITS.enemies - 3) {
          this.spawnEnemy('scout', boss.x - 10, boss.y - 6, false)
          this.spawnEnemy('interceptor', boss.x + 10, boss.y - 6, false)
        }
        break
      case 'mines':
        for (let index = 0; index < 4; index += 1) {
          this.spawnBullet(boss.x + (index - 1.5) * 8, boss.y - 4, 0, -10, 10, '#fcd34d', true, { kind: 'mine', r: 2.4, life: 10 })
        }
        break
      case 'burst':
        for (let volley = 0; volley < 5; volley += 1) {
          const angle = aim + (this.rng() - 0.5) * 0.5
          const delay = volley * 0.12
          this.spawnBullet(boss.x, boss.y, Math.cos(angle) * speed, Math.sin(angle) * speed, 7, '#fda4af', true, { life: 2 + delay, r: 1.1 })
        }
        break
      case 'laser': {
        const offset = this.player.x > 0 ? -12 : 12
        this.beams.push({ x: this.player.x, width: 7, warm: 0.95, life: 0.5, damage: 18, hostile: true })
        this.beams.push({ x: clamp(this.player.x + offset, -40, 40), width: 6, warm: 1.2, life: 0.45, damage: 14, hostile: true })
        this.events.push({ type: 'beam', x: this.player.x, y: boss.y })
        break
      }
    }
  }

  private damageBoss(amount: number): void {
    const boss = this.boss
    if (!boss || !boss.alive) return
    const aliveParts = boss.parts.filter((part) => part.alive).length
    const armour = aliveParts > 0 ? 0.35 : 1
    boss.hp -= amount * armour
    boss.flash = 1
    // Turrets fall away as the hull weakens, which is what opens the core.
    const targetAlive = Math.max(0, Math.ceil(boss.parts.length * Math.max(0, boss.hp / boss.maxHp)))
    boss.parts.forEach((part, index) => {
      part.alive = index < targetAlive
    })
    if (boss.hp <= 0) {
      boss.hp = 0
      boss.alive = false
      this.bossDefeated = true
      this.boss = boss
      this.award(2000 + boss.spec.reward)
      this.credits += boss.spec.reward
      for (let index = 0; index < 8; index += 1) {
        this.events.push({
          type: 'explode',
          x: boss.x + (this.rng() - 0.5) * boss.spec.radius * 2,
          y: boss.y + (this.rng() - 0.5) * boss.spec.radius,
          size: 8 + this.rng() * 10,
          color: boss.spec.accent,
        })
      }
      this.bullets = this.bullets.filter((bullet) => !bullet.hostile)
      this.effects.set('invuln', Math.max(this.effects.get('invuln') ?? 0, 1.5))
    }
  }

  // ------------------------------------------------------------------ asteroids

  private updateAsteroids(dt: number): void {
    if (this.mission.hazards.includes('asteroid')) {
      this.asteroidTimer -= dt
      if (this.asteroidTimer <= 0 && this.asteroids.length < 10) {
        this.asteroidTimer = 1.4 + this.rng() * 1.2
        const r = 3 + this.rng() * 4.5
        this.asteroids.push({
          id: this.nextId++,
          x: (this.rng() - 0.5) * (FIELD.width - 12),
          y: FIELD.height + 6,
          vx: (this.rng() - 0.5) * 10,
          vy: -(16 + this.rng() * 22),
          r,
          hp: r * 12,
          spin: this.rng() * TAU,
        })
      }
    }
    for (const rock of this.asteroids) {
      rock.x += rock.vx * dt
      rock.y += rock.vy * dt
      rock.spin += dt
      if (rock.hp <= 0) {
        this.events.push({ type: 'explode', x: rock.x, y: rock.y, size: rock.r * 2, color: '#a8a29e' })
        this.asteroids = this.asteroids.filter((entry) => entry !== rock)
        continue
      }
      if (Math.hypot(rock.x - this.player.x, rock.y - this.player.y) < rock.r + 3.2) {
        this.hurtPlayer(14 + rock.r * 2.4)
        rock.hp = 0
      }
      if (this.station && Math.hypot(rock.x - this.station.x, rock.y - this.station.y) < rock.r + 6) {
        this.station.hp -= 10
        rock.hp = 0
      }
    }
    this.asteroids = this.asteroids.filter((rock) => rock.y > FIELD.despawnY - 10 && rock.hp > 0)
  }

  // --------------------------------------------------------------------- combat

  private updateBullets(dt: number): void {
    for (const bullet of this.bullets) {
      if (bullet.kind === 'missile') {
        const target = this.nearestEnemy(bullet.x, bullet.y)
        if (target) {
          const angle = Math.atan2(target.y - bullet.y, target.x - bullet.x)
          bullet.vx += Math.cos(angle) * 260 * dt
          bullet.vy += Math.sin(angle) * 260 * dt
          const speed = Math.hypot(bullet.vx, bullet.vy)
          const max = 130
          if (speed > max) {
            bullet.vx = (bullet.vx / speed) * max
            bullet.vy = (bullet.vy / speed) * max
          }
        }
      }
      bullet.x += bullet.vx * dt
      bullet.y += bullet.vy * dt
      bullet.life -= dt

      if (bullet.hostile) {
        if (this.station && Math.hypot(bullet.x - this.station.x, bullet.y - this.station.y) < 8) {
          this.station.hp -= bullet.damage
          bullet.life = 0
          continue
        }
        const distance = Math.hypot(bullet.x - this.player.x, bullet.y - this.player.y)
        if (distance < bullet.r + 2.4) {
          if (this.active('reflect')) {
            bullet.hostile = false
            bullet.vx *= -0.6
            bullet.vy = Math.abs(bullet.vy) * 0.8 + 40
            bullet.damage *= 2
            bullet.color = '#fef3c7'
            this.events.push({ type: 'hit', x: bullet.x, y: bullet.y })
            continue
          }
          this.hurtPlayer(bullet.damage)
          bullet.life = 0
          continue
        }
        continue
      }

      // Player fire: asteroids, then enemies, then the boss.
      for (const rock of this.asteroids) {
        if (rock.hp <= 0) continue
        if (Math.hypot(bullet.x - rock.x, bullet.y - rock.y) < bullet.r + rock.r) {
          rock.hp -= bullet.damage
          if (rock.hp <= 0) this.award(30)
          this.damageSplash(bullet)
          bullet.life = 0
          break
        }
      }
      if (bullet.life <= 0) continue

      let hit = false
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0) continue
        if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < bullet.r + enemy.r) {
          this.hitEnemy(enemy, bullet)
          hit = true
          if (bullet.pierce > 0) {
            bullet.pierce -= 1
            continue
          }
          bullet.life = 0
          break
        }
      }
      if (hit) continue

      const boss = this.boss
      if (boss && boss.alive && !boss.entering) {
        if (Math.abs(bullet.x - boss.x) < boss.spec.radius && Math.abs(bullet.y - boss.y) < boss.spec.radius * 0.7) {
          this.damageBoss(bullet.damage)
          this.damageSplash(bullet)
          this.shotsHit += 1
          if (bullet.pierce > 0) bullet.pierce -= 1
          else bullet.life = 0
          this.events.push({ type: 'hit', x: bullet.x, y: bullet.y })
        }
      }
    }
    this.bullets = this.bullets.filter(
      (bullet) => bullet.life > 0 && Math.abs(bullet.x) < FIELD.halfWidth + 14 && bullet.y > -20 && bullet.y < FIELD.height + 24,
    )
  }

  private damageSplash(bullet: Bullet): void {
    if (bullet.explosive <= 0) return
    for (const enemy of this.enemies) {
      if (enemy.hp > 0 && Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y) < bullet.explosive + 3) {
        enemy.hp -= bullet.damage * 0.5
        enemy.flash = 1
        if (enemy.hp <= 0) this.killEnemy(enemy)
      }
    }
    if (this.boss && this.boss.alive) this.damageBoss(bullet.damage * 0.25)
    this.events.push({ type: 'explode', x: bullet.x, y: bullet.y, size: bullet.explosive, color: '#fdba74' })
  }

  private hitEnemy(enemy: Enemy, bullet: Bullet): void {
    this.shotsHit += 1
    const shielded = enemy.shielded > 0 ? 0.45 : 1
    const crit = this.active('critBoost') ? this.rng() < 0.45 : this.rng() < 0.06
    const damage = bullet.damage * shielded * (crit ? 2 : 1)
    enemy.hp -= damage
    enemy.flash = 1
    this.events.push({ type: 'hit', x: bullet.x, y: bullet.y, color: crit ? '#fef08a' : bullet.color })
    if (bullet.chain) {
      const nearest = this.enemies
        .filter((other) => other !== enemy && other.hp > 0)
        .sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y))[0]
      if (nearest && Math.hypot(nearest.x - enemy.x, nearest.y - enemy.y) < 26) {
        nearest.hp -= damage * 0.45
        nearest.flash = 1
        this.events.push({ type: 'arc', x: enemy.x, y: enemy.y, x2: nearest.x, y2: nearest.y })
        if (nearest.hp <= 0) this.killEnemy(nearest)
      }
    }
    if (bullet.explosive > 0) this.damageSplash(bullet)
    if (enemy.hp <= 0) this.killEnemy(enemy)
  }

  private killEnemy(enemy: Enemy): void {
    if (enemy.hp <= -1) return
    if (enemy.hp <= 0 && enemy.y > FIELD.despawnY) {
      this.events.push({ type: 'explode', x: enemy.x, y: enemy.y, size: enemy.r * 1.8, color: enemy.spec.accent })
    }
    enemy.hp = -1
    this.kills += 1
    if (enemy.spec.behavior === 'ace' || enemy.spec.id === 'miniboss') this.eliteKills += 1
    if (enemy.priority) this.priorityKilled += 1
    this.combo += 1
    this.comboTimer = 2.6
    this.award(enemy.spec.score)
    this.credits += Math.round(enemy.spec.score / 8)
    if (this.mods.noPowerups) return
    if (this.mission.allowedPowerUps.length === 0) return
    const chance = 0.16 + this.mission.difficulty * 0.004
    if (this.rng() < chance) {
      const allowed = this.mission.allowedPowerUps
      const rarity = weighted(this.rng, [
        [1, DROP_WEIGHTS[1] ?? 60],
        [2, DROP_WEIGHTS[2] ?? 25],
        [3, DROP_WEIGHTS[3] ?? 10],
        [4, DROP_WEIGHTS[4] ?? 4],
      ] as const)
      const pool = allowed.filter((id) => POWERUP_BY_ID.get(id as EffectId)?.rarity === rarity)
      const id = (pool.length > 0 ? pool[Math.floor(this.rng() * pool.length)] : allowed[Math.floor(this.rng() * allowed.length)]) as EffectId
      this.spawnPickup(enemy.x, enemy.y, id, false)
    }
  }

  private spawnPickup(x: number, y: number, effect: EffectId, resource: boolean): void {
    if (this.pickups.length >= LIMITS.pickups) return
    this.pickups.push({ id: this.nextId++, x, y, vy: resource ? -22 : -26, effect, resource, ttl: 12 })
  }

  private updatePickups(dt: number): void {
    if (this.mission.objective.kind === 'resource') {
      this.resourceTimer -= dt
      if (this.resourceTimer <= 0 && this.resources + this.pickups.filter((pickup) => pickup.resource).length < this.mission.objective.target) {
        this.resourceTimer = 3.2
        this.spawnPickup((this.rng() - 0.5) * 60, FIELD.height + 4, 'credits', true)
      }
    }
    const magnet = this.active('magnet')
    for (const pickup of this.pickups) {
      pickup.ttl -= dt
      pickup.y += pickup.vy * dt
      pickup.vy = Math.max(-40, pickup.vy - 8 * dt)
      if (magnet) {
        const dx = this.player.x - pickup.x
        const dy = this.player.y - pickup.y
        const length = Math.max(1, Math.hypot(dx, dy))
        pickup.x += (dx / length) * 60 * dt
        pickup.y += (dy / length) * 60 * dt
      }
      if (Math.hypot(pickup.x - this.player.x, pickup.y - this.player.y) < 6) {
        pickup.ttl = 0
        if (pickup.resource) {
          this.resources += 1
          this.award(120)
          this.events.push({ type: 'pickup', x: pickup.x, y: pickup.y, color: '#8ef0c8' })
        } else {
          this.applyPowerup(pickup.effect)
        }
      }
    }
    this.pickups = this.pickups.filter((pickup) => pickup.ttl > 0 && pickup.y > FIELD.despawnY)
  }

  // -------------------------------------------------------------------- effects

  applyPowerup(id: EffectId): void {
    const spec = POWERUP_BY_ID.get(id)
    if (!spec) return
    this.events.push({ type: 'pickup', x: this.player.x, y: this.player.y + 4, color: spec.color })
    const hold = (effect: EffectId, duration: number): void => {
      this.effects.set(effect, Math.max(this.effects.get(effect) ?? 0, duration))
    }
    switch (id) {
      case 'weaponUp':
        this.weaponLevel = Math.min(5, this.weaponLevel + 1)
        break
      case 'weaponSwap': {
        const list = ['pulse', 'spread', 'beam', 'ion', 'photon', 'rail', 'arc', 'particle', 'fusion', 'wave']
        const index = list.indexOf(this.weaponId)
        this.weaponId = list[(index + 1) % list.length] as string
        break
      }
      case 'rapid':
      case 'double':
      case 'triple':
      case 'spread':
      case 'laserUp':
      case 'plasmaUp':
        hold(id, spec.duration)
        break
      case 'missiles':
        hold('missiles', spec.duration)
        break
      case 'missileBarrage':
        this.charges.barrage = 2
        this.missileTimer = 0
        break
      case 'shieldRecharge':
        this.player.shield = Math.min(this.player.maxShield, this.player.shield + this.player.maxShield * 0.5)
        break
      case 'megaShield': {
        const base = this.ship.shield
        this.player.maxShield = Math.round(base * 2)
        this.player.shield = this.player.maxShield
        hold('megaShield', spec.duration)
        break
      }
      case 'invuln':
        hold('invuln', spec.duration)
        break
      case 'hullRepair':
        this.player.hull = Math.min(this.player.maxHull, this.player.hull + 35)
        break
      case 'fullRepair':
        this.player.hull = this.player.maxHull
        this.player.shield = this.player.maxShield
        break
      case 'extraLife':
        this.player.lives = Math.min(5, this.player.lives + 1)
        break
      case 'speedBoost':
        hold('speedBoost', spec.duration)
        break
      case 'timeSlow':
        hold('timeSlow', spec.duration)
        break
      case 'emp':
        for (const enemy of this.enemies) enemy.stun = Math.max(enemy.stun, 2.4)
        this.bullets = this.bullets.filter((bullet) => !bullet.hostile)
        break
      case 'screenBomb':
        this.charges.bombs += 1
        break
      case 'megaBomb':
        this.charges.bombs += 2
        break
      case 'drone':
        if (this.drones.length < LIMITS.drones) this.drones.push({ x: this.player.x - 7, y: this.player.y, fireTimer: 0.3, offset: -7 })
        break
      case 'twinDrone':
        while (this.drones.length < Math.min(LIMITS.drones, 2)) {
          this.drones.push({ x: this.player.x + 7, y: this.player.y, fireTimer: 0.3, offset: 7 })
        }
        break
      case 'droneUpgrade':
        hold('droneUpgrade', spec.duration)
        break
      case 'damageBoost':
        hold('damageBoost', spec.duration)
        break
      case 'critBoost':
        hold('critBoost', spec.duration)
        break
      case 'energyRegen':
        hold('energyRegen', spec.duration)
        this.player.abilityCooldown = Math.max(0, this.player.abilityCooldown - 6)
        break
      case 'reflect':
        hold('reflect', spec.duration)
        break
      case 'magnet':
        hold('magnet', spec.duration)
        break
      case 'scoreMult':
        hold('scoreMult', spec.duration)
        break
      case 'credits':
        this.credits += 250
        break
      case 'chain':
        hold('chain', spec.duration)
        break
      case 'pierce':
        hold('pierce', spec.duration)
        break
      case 'explosive':
        hold('explosive', spec.duration)
        break
      case 'phoenix':
        this.radialDamage(28, 220)
        break
      case 'gravity':
        for (const enemy of this.enemies) {
          const dx = enemy.x - this.player.x
          const dy = enemy.y - this.player.y
          const length = Math.max(1, Math.hypot(dx, dy))
          enemy.x += (dx / length) * 18
          enemy.y += (dy / length) * 18
          enemy.stun = Math.max(enemy.stun, 1.2)
        }
        this.bullets = this.bullets.filter((bullet) => !bullet.hostile)
        break
      case 'repairDrone':
        hold('repairDrone', spec.duration)
        break
      case 'shieldDrone':
        hold('shieldDrone', spec.duration)
        break
      case 'overdrive':
        hold('overdrive', spec.duration)
        break
      case 'starfall':
        this.radialDamage(120, 520)
        this.bullets = this.bullets.filter((bullet) => !bullet.hostile)
        break
    }
  }

  private radialDamage(radius: number, damage: number): void {
    for (const enemy of this.enemies) {
      if (Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y) < radius) {
        enemy.hp -= damage
        enemy.flash = 1
        if (enemy.hp <= 0) this.killEnemy(enemy)
      }
    }
    if (this.boss?.alive) this.damageBoss(damage * 0.7)
    for (let index = 0; index < 10; index += 1) {
      const angle = (index / 10) * TAU
      this.events.push({
        type: 'explode',
        x: this.player.x + Math.cos(angle) * radius * 0.6,
        y: this.player.y + Math.sin(angle) * radius * 0.6,
        size: radius * 0.4,
        color: '#fdba74',
      })
    }
  }

  private updateBeams(dt: number): void {
    for (const beam of this.beams) {
      if (beam.warm > 0) {
        beam.warm -= dt
        if (beam.warm <= 0) {
          if (beam.hostile && Math.abs(this.player.x - beam.x) < beam.width / 2 + 2.2 && this.player.y < 150) {
            this.hurtPlayer(beam.damage)
          }
          this.events.push({ type: 'beam', x: beam.x, y: 60, color: '#fca5a5' })
        }
        continue
      }
      beam.life -= dt
    }
    this.beams = this.beams.filter((beam) => beam.life > 0 || beam.warm > 0)
  }

  private updateStation(dt: number): void {
    if (!this.station) {
      const kind = this.mission.objective.kind === 'defense' ? 'relay' : this.mission.objective.kind === 'escort' ? 'courier' : null
      if (kind) {
        this.station = {
          x: 0,
          y: kind === 'relay' ? 150 : 132,
          hp: kind === 'relay' ? 260 : 150,
          maxHp: kind === 'relay' ? 260 : 150,
          kind,
          angle: 0,
        }
      }
      return
    }
    if (this.station.kind === 'courier') {
      this.station.angle += dt
      this.station.x = Math.sin(this.station.angle * 0.8) * 26
    }
    if (this.station.hp <= 0) this.fail('The escort was destroyed.')
    if (this.station.kind === 'relay' && this.time > 0 && this.time % 1 < dt) {
      // Relay takes a slow trickle from the surrounding fleet.
      this.station.hp -= 0.4
    }
  }

  // ------------------------------------------------------------------- damage

  hurtPlayer(amount: number): void {
    if (this.phase !== 'active') return
    if (this.mods.noDamage) return
    if (this.player.invuln > 0 || this.active('invuln')) return
    if (this.active('shieldDrone') && this.rng() < 0.35) {
      this.events.push({ type: 'hit', x: this.player.x, y: this.player.y + 4 })
      return
    }
    let remaining = amount
    if (this.player.shield > 0) {
      const absorbed = Math.min(this.player.shield, remaining)
      this.player.shield -= absorbed
      remaining -= absorbed
      this.shieldRegenDelay = 3
    }
    if (remaining > 0) {
      this.player.hull -= remaining
      this.damageTaken += remaining
      this.player.invuln = 0.7
      this.events.push({ type: 'explode', x: this.player.x, y: this.player.y, size: 5, color: '#f87171' })
    }
    if (this.active('megaShield') && this.player.shield <= 0) this.effects.delete('megaShield')
    if (this.player.hull <= 0) this.playerDown()
  }

  private playerDown(): void {
    this.player.hull = 0
    this.events.push({ type: 'death', x: this.player.x, y: this.player.y, size: 10, color: '#fca5a5' })
    const canRespawn = !this.mods.oneLife && this.player.lives > 1
    if (!canRespawn) {
      this.fail('Your hull was breached.')
      return
    }
    this.resetPlayer(false)
    this.combo = 0
  }

  private fail(reason: string): void {
    if (this.phase !== 'active') return
    this.phase = 'defeat'
    this.events.push({ type: 'lose', x: 0, y: 0, color: reason })
  }

  // ------------------------------------------------------------------ objective

  private checkObjective(): void {
    if (this.phase !== 'active') return
    if (this.mods.noDamage && this.damageTaken > 0) {
      this.fail('No-damage run broken.')
      return
    }
    if (this.priorityEscaped > 0) {
      this.fail('A runner escaped.')
      return
    }
    const objective = this.mission.objective
    const progress = this.progress()
    switch (objective.kind) {
      case 'eliminate':
      case 'gauntlet':
        if (this.kills >= objective.target) this.complete()
        break
      case 'survive':
      case 'asteroid':
        if (this.time >= objective.target) this.complete()
        break
      case 'escort':
      case 'defense':
        if (this.time >= objective.target) this.complete()
        break
      case 'resource':
        if (this.resources >= objective.target) this.complete()
        break
      case 'interception':
        if (this.priorityKilled >= objective.target) this.complete()
        break
      case 'elite':
        if (this.eliteKills >= objective.target) this.complete()
        break
      case 'boss':
        if (this.bossDefeated) this.complete()
        break
    }
    if (this.time > this.mission.duration + 1.5 && objective.kind !== 'boss' && progress < 1) {
      // A mission that runs long without meeting its goal is a miss, not a hang.
      this.fail('The window closed.')
    }
  }

  private complete(): void {
    if (this.phase !== 'active') return
    this.phase = 'victory'
    this.award(500)
    this.events.push({ type: 'win', x: 0, y: 0 })
  }

  private award(base: number): void {
    const comboMul = 1 + Math.min(1.5, this.combo * 0.04)
    const scoreMul = this.active('scoreMult') ? 2 : 1
    this.score += Math.round(base * comboMul * scoreMul)
  }

  progress(): number {
    const objective = this.mission.objective
    switch (objective.kind) {
      case 'eliminate':
      case 'gauntlet':
        return Math.min(objective.target, this.kills)
      case 'survive':
      case 'asteroid':
      case 'escort':
      case 'defense':
        return Math.min(objective.target, Math.floor(this.time))
      case 'resource':
        return this.resources
      case 'interception':
        return this.priorityKilled
      case 'elite':
        return this.eliteKills
      case 'boss':
        return this.bossDefeated ? 1 : 0
    }
  }

  // --------------------------------------------------------------------- extras

  fireSecondary(): boolean {
    if (this.phase !== 'active' || this.player.secondaryTimer > 0 || this.player.secondaryCharges <= 0) return false
    const spec = secondaryById(this.secondary)
    this.player.secondaryCharges -= 1
    this.player.secondaryTimer = spec.cooldown * (this.active('energyRegen') ? 0.6 : 1)
    switch (spec.id) {
      case 'missiles':
        this.fireMissiles(3)
        break
      case 'torpedo':
        for (let index = -1; index <= 1; index += 1) {
          this.spawnBullet(this.player.x, this.player.y, index * 40, 120, spec.damage, spec.color, false, { kind: 'orb', r: 1.6, explosive: spec.radius })
        }
        break
      case 'emp':
        for (const enemy of this.enemies) enemy.stun = 3
        this.bullets = this.bullets.filter((bullet) => !bullet.hostile)
        this.radialDamage(spec.radius, spec.damage)
        break
      case 'mine':
        for (let index = 0; index < 3; index += 1) {
          this.spawnBullet(this.player.x + (index - 1) * 4, this.player.y + 8, 0, 30, spec.damage, spec.color, false, { kind: 'mine', r: 2.2, life: 12, explosive: spec.radius })
        }
        break
      case 'orbital':
        this.radialDamage(spec.radius, spec.damage)
        this.events.push({ type: 'beam', x: this.player.x, y: 120, color: spec.color })
        break
    }
    this.events.push({ type: 'shot', x: this.player.x, y: this.player.y, color: spec.color })
    return true
  }

  useBomb(): boolean {
    if (this.phase !== 'active' || this.charges.bombs <= 0) return false
    this.charges.bombs -= 1
    this.radialDamage(120, 160)
    this.bullets = this.bullets.filter((bullet) => !bullet.hostile)
    this.player.invuln = Math.max(this.player.invuln, 1)
    return true
  }

  useAbility(): boolean {
    if (this.phase !== 'active' || this.player.abilityCooldown > 0) return false
    const cooldown = this.active('energyRegen') ? 15 : 22
    this.player.abilityCooldown = cooldown
    switch (this.ship.ability) {
      case 'overdrive':
        this.effects.set('overdrive', 8)
        break
      case 'phase':
        this.player.invuln = 2.5
        break
      case 'bastion':
        this.player.shield = this.player.maxShield
        break
      case 'pierce':
        this.effects.set('pierce', 6)
        break
      case 'cloak':
        this.player.invuln = 3
        this.bullets = this.bullets.filter((bullet) => !bullet.hostile)
        break
      case 'inferno':
        this.radialDamage(70, 220)
        break
      case 'aegis':
        this.player.maxShield = Math.round(this.ship.shield * 2)
        this.player.shield = this.player.maxShield
        this.effects.set('megaShield', 10)
        break
      case 'storm':
        for (const enemy of this.enemies) {
          enemy.hp -= 180
          if (enemy.hp <= 0) this.killEnemy(enemy)
          this.events.push({ type: 'arc', x: this.player.x, y: this.player.y, x2: enemy.x, y2: enemy.y })
        }
        if (this.boss?.alive) this.damageBoss(160)
        break
      case 'crit':
        this.effects.set('critBoost', 4)
        break
      case 'nova':
        this.radialDamage(140, 420)
        this.bullets = this.bullets.filter((bullet) => !bullet.hostile)
        break
    }
    return true
  }

  private nearestEnemy(x: number, y: number): Enemy | null {
    let best: Enemy | null = null
    let bestDistance = Infinity
    for (const enemy of this.enemies) {
      if (enemy.hp <= 0) continue
      const distance = Math.hypot(enemy.x - x, enemy.y - y)
      if (distance < bestDistance) {
        bestDistance = distance
        best = enemy
      }
    }
    if (this.boss?.alive) {
      const distance = Math.hypot(this.boss.x - x, this.boss.y - y)
      if (distance < bestDistance) return null
    }
    return best
  }

  private cleanup(): void {
    this.enemies = this.enemies.filter((enemy) => enemy.hp > 0)
    this.bullets = this.bullets.filter((bullet) => bullet.life > 0)
    if (!this.active('megaShield') && this.player.maxShield > Math.round(this.ship.shield * 1.9)) {
      this.player.maxShield = Math.round(this.ship.shield)
      this.player.shield = Math.min(this.player.shield, this.player.maxShield)
    }
    if (this.events.length > 220) this.events = this.events.slice(-120)
  }

  snapshot(): Snapshot {
    const effects = [...this.effects.entries()]
      .filter(([, remaining]) => remaining > 0)
      .map(([id, remaining]) => {
        const spec = POWERUP_BY_ID.get(id)
        return { id, name: spec?.name ?? id, glyph: spec?.glyph ?? '?', remaining }
      })
    const boss = this.boss
    return {
      phase: this.phase,
      score: this.score,
      hull: Math.max(0, Math.round(this.player.hull)),
      maxHull: this.player.maxHull,
      shield: Math.max(0, Math.round(this.player.shield)),
      maxShield: this.player.maxShield,
      lives: this.player.lives,
      weapon: weaponById(this.weaponId).name,
      weaponLevel: this.weaponLevel,
      secondary: secondaryById(this.secondary).name,
      secondaryCharges: this.player.secondaryCharges,
      abilityReady: 1 - this.player.abilityCooldown / 22,
      bombs: this.charges.bombs,
      drones: this.drones.length,
      combo: this.combo,
      kills: this.kills,
      time: this.time,
      progress: this.progress(),
      progressTarget: this.mission.objective.target,
      objective: this.mission.objective,
      boss: boss
        ? {
            name: boss.spec.name,
            hp: Math.max(0, Math.round(boss.hp)),
            maxHp: Math.round(boss.maxHp),
            phase: boss.phase,
            parts: boss.parts.filter((part) => part.alive).length,
          }
        : null,
      effects,
      station: this.station ? { hp: Math.max(0, Math.round(this.station.hp)), maxHp: this.station.maxHp, kind: this.station.kind } : null,
      lowHull: this.player.hull / this.player.maxHull < 0.3,
    }
  }

  stats(): { kills: number; damageTaken: number; accuracy: number; score: number; credits: number } {
    return {
      kills: this.kills,
      damageTaken: Math.round(this.damageTaken),
      accuracy: this.shotsFired > 0 ? Math.min(1, this.shotsHit / Math.max(1, this.shotsFired)) : 0,
      score: this.score,
      credits: this.credits,
    }
  }

  behaviorOf(enemy: Enemy): Behavior {
    return enemy.spec.behavior
  }
}

export type { WeaponLevel }
export const SIM_VERSION = 1
