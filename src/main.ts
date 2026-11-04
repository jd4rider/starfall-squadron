import './style.css'
import { CAMPAIGN, SIM_STEP } from './core/constants'
import { audio } from './audio'
import type { MissionDefinition, PersistedGame } from './core/types'
import type { EffectId } from './content/powerups'
import { sectorById } from './content/sectors'
import {
  bossRushMission,
  challengeMission,
  dailyMission,
  endlessMission,
  generateCampaign,
  generateMission,
  type ChallengeId,
} from './levels/generate'
import {
  ACHIEVEMENTS,
  buyCosmetic,
  buyShip,
  buyWeaponLevel,
  clearedCount,
  createSave,
  equipShip,
  isMissionUnlocked,
  loadSave,
  recordMission,
  sectorProgress,
  writeSave,
  type MissionResult,
} from './platform/save'
import { SceneRenderer } from './render/scene'
import { CombatSim, starsFor, type RunModifiers } from './sim/combat'
import { UI, type ModeId, type UIHandlers } from './ui/ui'

const COSMETIC_COST: Record<string, number> = {
  std: 0,
  solar: 400,
  void: 550,
  emerald: 650,
  crimson: 800,
  aurora: 1100,
}

function todayKey(): string {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`
}

const MODS: Record<ChallengeId, RunModifiers> = {
  oneLife: { oneLife: true },
  noShields: { noShields: true },
  basicWeapon: { basicWeapon: true },
  missileOnly: { missileOnly: true },
  droneCommander: { drones: 2 },
  speedClear: { speed: 1.25 },
  noDamage: { noDamage: true },
  survival: { oneLife: true, eliteFleet: true },
  precision: { speed: 1.1 },
  eliteFleet: { eliteFleet: true },
}

class App implements UIHandlers {
  private readonly canvas: HTMLCanvasElement
  private readonly renderer: SceneRenderer
  private readonly ui: UI
  private save: PersistedGame
  private readonly campaign: MissionDefinition[]
  private sim: CombatSim | null = null
  private mission: MissionDefinition | null = null
  private mode: ModeId = 'campaign'
  private paused = false
  private resultShown = false
  private last = performance.now()
  private accumulator = 0
  private stage = 1
  private round = 1
  private driverKills = 0
  private readonly keys = new Set<string>()
  private pointerId: number | null = null
  private pointerStart = { x: 0, y: 0 }
  private shipStart = { x: 0, y: 0 }
  private dronePeak = 0
  private lastSound = 0

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>('#scene')
    const uiRoot = document.querySelector<HTMLElement>('#ui')
    if (!canvas || !uiRoot) throw new Error('Starfall Squadron needs #scene and #ui')
    this.canvas = canvas
    this.renderer = new SceneRenderer(canvas)
    this.save = loadSave()
    this.campaign = generateCampaign()
    this.ui = new UI(uiRoot, this.save, this)
    this.applySettings()
    this.ui.showMenu()
    this.renderer.showMenu()
    this.renderer.setShip(this.save.ship)
    this.renderer.setSector(sectorById(1))
    this.bindInput()
    window.addEventListener('resize', () => this.renderer.resize())
    // The arcade embeds the game in a resizable iframe; observing the canvas
    // catches layout changes that never fire a window resize.
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(() => this.renderer.resize()).observe(canvas)
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.sim && this.sim.phase === 'active') this.pause()
    })
    window.addEventListener('beforeunload', () => writeSave(this.save))
    this.last = performance.now()
    requestAnimationFrame(this.frame)
  }

  private applySettings(): void {
    const settings = this.save.settings
    audio.setEnabled(settings.sound)
    audio.setMusic(settings.music)
    this.renderer.setQuality(settings.quality)
    this.renderer.setShip(this.save.ship)
    document.body.classList.toggle('reduce-motion', !settings.motion)
    document.body.classList.toggle('high-contrast', settings.highContrast)
    document.body.classList.toggle('left-handed', settings.leftHanded)
  }

  setting(key: string, value: string | boolean | number): void {
    const settings = this.save.settings as unknown as Record<string, string | boolean | number>
    settings[key] = value
    writeSave(this.save)
    this.applySettings()
    audio.play('ui')
    this.ui.toast('Setting saved')
    if (key === 'quality' || key === 'control' || key === 'leftHanded' || key === 'highContrast' || key === 'motion') {
      this.ui.showSettings()
    }
  }

  // ---------------------------------------------------------------------- modes

  continueCampaign(): void {
    const index = Math.max(1, Math.min(CAMPAIGN.missions, this.save.lastMission))
    this.startMission(index)
  }

  openSectors(): void {
    audio.play('ui')
    this.ui.showSectors()
  }

  openMissions(sector: number): void {
    audio.play('ui')
    this.ui.showMissions(sector)
  }

  startMission(index: number): void {
    if (!isMissionUnlocked(this.save, index)) {
      this.ui.toast('Clear the previous mission first.')
      return
    }
    const mission = this.campaign[index - 1] ?? generateMission(index)
    this.begin(mission, 'campaign')
  }

  startMode(mode: ModeId): void {
    audio.play('ui')
    this.stage = 1
    this.round = 1
    switch (mode) {
      case 'campaign':
        this.continueCampaign()
        return
      case 'endless':
        this.begin(endlessMission(1), 'endless')
        return
      case 'bossrush':
        this.begin(bossRushMission(1), 'bossrush')
        return
      case 'daily':
        this.begin(dailyMission(new Date()), 'daily')
        return
      case 'arcade':
        this.begin(generateMission(31), 'arcade', { oneLife: true })
        return
      case 'zen':
        this.begin(
          {
            ...generateMission(121),
            name: 'Zen Patrol',
            brief: 'No pressure. Fly the lane for as long as you like.',
            objective: { kind: 'survive', target: 600, label: 'Fly as long as you like' },
            duration: 620,
          },
          'zen',
          { speed: 0.9 },
        )
        return
      case 'challenge':
        this.ui.showChallenges()
        return
    }
  }

  startChallenge(id: ChallengeId): void {
    this.begin(challengeMission(id), 'challenge', MODS[id])
  }

  private begin(mission: MissionDefinition, mode: ModeId, mods: RunModifiers = {}): void {
    this.mission = mission
    this.mode = mode
    this.paused = false
    this.resultShown = false
    this.accumulator = 0
    this.dronePeak = 0
    this.driverKills = 0
    this.sim = new CombatSim({
      mission,
      shipId: this.save.ship,
      primary: this.save.primary,
      secondary: this.save.secondary,
      primaryLevel: mode === 'arcade' || mode === 'challenge' ? 1 : (this.save.weapons[this.save.primary] ?? 1),
      mods,
    })
    this.renderer.setSector(sectorById(mission.sector))
    this.renderer.setShip(this.save.ship)
    this.renderer.showGame(this.sim)
    this.ui.showGame(mission)
    audio.unlock()
    if (this.save.settings.music) audio.startMusic()
    this.last = performance.now()
  }

  pause(): void {
    if (!this.sim || this.sim.phase !== 'active' || this.paused) return
    this.paused = true
    this.ui.showPause()
    audio.play('ui')
  }

  resume(): void {
    this.paused = false
    this.ui.closeOverlay()
    this.last = performance.now()
    audio.play('ui')
  }

  restart(): void {
    if (!this.mission) return
    this.begin(this.mission, this.mode, this.sim?.mods ?? {})
  }

  retry(): void {
    this.restart()
  }

  nextMission(): void {
    if (!this.mission) return
    if (this.mode === 'endless') {
      this.stage += 1
      this.begin(endlessMission(this.stage), 'endless')
      return
    }
    if (this.mode === 'bossrush') {
      this.round += 1
      if (this.round > 10) {
        this.save.bossRushBest = 10
        writeSave(this.save)
        this.ui.toast('All ten flagships down.')
        this.quit()
        return
      }
      this.begin(bossRushMission(this.round), 'bossrush')
      return
    }
    if (this.mode === 'campaign') {
      const next = Math.min(CAMPAIGN.missions, this.mission.index + 1)
      if (isMissionUnlocked(this.save, next)) this.startMission(next)
      else this.quit()
      return
    }
    this.restart()
  }

  quit(): void {
    audio.play('ui')
    audio.stopMusic()
    this.sim = null
    this.mission = null
    this.paused = false
    this.resultShown = false
    this.renderer.showMenu()
    this.renderer.setShip(this.save.ship)
    this.renderer.setSector(sectorById(1))
    this.ui.showMenu()
  }

  // --------------------------------------------------------------------- combat

  secondary(): void {
    if (this.sim?.fireSecondary()) {
      this.save.secondaryUsed = [...new Set([...this.save.secondaryUsed, this.save.secondary])].slice(0, 10)
      audio.play('missile')
    }
  }

  bomb(): void {
    if (this.sim?.useBomb()) audio.play('explode')
  }

  ability(): void {
    if (this.sim?.useAbility()) audio.play('shield')
  }

  // ----------------------------------------------------------------------- shop

  buyShip(id: string): void {
    if (buyShip(this.save, id)) {
      writeSave(this.save)
      this.ui.toast('Hangar expanded.')
      audio.play('pickup')
    } else {
      this.ui.toast('Not enough credits.')
    }
    this.ui.setSave(this.save)
    this.ui.showHangar()
  }

  equipShip(id: string): void {
    equipShip(this.save, id)
    writeSave(this.save)
    this.renderer.setShip(this.save.ship)
    this.ui.setSave(this.save)
    this.ui.showHangar()
  }

  buyWeapon(id: string): void {
    if (buyWeaponLevel(this.save, id)) {
      writeSave(this.save)
      this.ui.toast('Weapon upgraded.')
      audio.play('pickup')
    } else {
      this.ui.toast('Not enough credits, or already maxed.')
    }
    this.ui.setSave(this.save)
    this.ui.showHangar()
  }

  equipWeapon(id: string): void {
    this.save.primary = id
    writeSave(this.save)
    this.ui.showHangar()
  }

  equipSecondary(id: string): void {
    this.save.secondary = id
    writeSave(this.save)
    this.ui.showHangar()
  }

  buyCosmetic(id: string): void {
    const cost = COSMETIC_COST[id] ?? 0
    if (buyCosmetic(this.save, id, cost)) {
      this.save.cosmetics.trail = id
      writeSave(this.save)
      audio.play('pickup')
    } else {
      this.ui.toast('Not enough credits.')
    }
    this.ui.setSave(this.save)
    this.ui.showHangar()
  }

  equipCosmetic(id: string): void {
    this.save.cosmetics.trail = id
    writeSave(this.save)
    this.ui.showHangar()
  }

  eraseProgress(): void {
    this.save = createSave()
    writeSave(this.save)
    this.ui.setSave(this.save)
    this.applySettings()
    this.ui.showSettings()
    this.ui.toast('Progress erased.')
  }

  share(): void {
    const text = `Starfall Squadron — ${clearedCount(this.save)}/300 missions cleared, ${this.save.credits} credits.`
    if (navigator.share) void navigator.share({ title: 'Starfall Squadron', text })
    else {
      void navigator.clipboard?.writeText(text)
      this.ui.toast('Copied to clipboard.')
    }
  }

  // ---------------------------------------------------------------------- input

  private bindInput(): void {
    const canvas = this.canvas
    canvas.addEventListener('pointerdown', (event) => {
      if (!this.sim || this.paused) return
      audio.unlock()
      this.pointerId = event.pointerId
      canvas.setPointerCapture?.(event.pointerId)
      const point = this.toWorld(event.clientX, event.clientY)
      this.pointerStart = point
      this.shipStart = { x: this.sim.player.targetX, y: this.sim.player.targetY }
      if (this.save.settings.control === 'absolute') this.sim.setTarget(point.x, point.y + 11)
    })
    canvas.addEventListener('pointermove', (event) => {
      if (!this.sim || this.paused || this.pointerId !== event.pointerId) return
      const point = this.toWorld(event.clientX, event.clientY)
      if (this.save.settings.control === 'absolute') {
        const offset = 11 * (this.save.settings.sensitivity ?? 1)
        this.sim.setTarget(point.x, point.y + offset)
      } else {
        this.sim.setTarget(this.shipStart.x + (point.x - this.pointerStart.x), this.shipStart.y + (point.y - this.pointerStart.y))
      }
    })
    const end = (event: PointerEvent): void => {
      if (this.pointerId === event.pointerId) this.pointerId = null
    }
    canvas.addEventListener('pointerup', end)
    canvas.addEventListener('pointercancel', end)
    canvas.addEventListener('contextmenu', (event) => event.preventDefault())

    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase()
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'w', 'a', 's', 'd'].includes(key)) event.preventDefault()
      this.keys.add(key)
      if (key === 'escape' || key === 'p') {
        if (this.paused) this.resume()
        else this.pause()
      }
      if (key === ' ') this.secondary()
      if (key === 'b') this.bomb()
      if (key === 'e' || key === 'shift') this.ability()
    })
    window.addEventListener('keyup', (event) => this.keys.delete(event.key.toLowerCase()))
  }

  /** Screen → logical field coordinates, using the renderer's live framing. */
  private toWorld(clientX: number, clientY: number): { x: number; y: number } {
    return this.renderer.screenToWorld(clientX, clientY)
  }

  private updateKeys(dt: number): void {
    if (!this.sim || this.paused || this.keys.size === 0) return
    const player = this.sim.player
    let dx = 0
    let dy = 0
    if (this.keys.has('arrowleft') || this.keys.has('a')) dx -= 1
    if (this.keys.has('arrowright') || this.keys.has('d')) dx += 1
    if (this.keys.has('arrowup') || this.keys.has('w')) dy += 1
    if (this.keys.has('arrowdown') || this.keys.has('s')) dy -= 1
    if (dx !== 0 || dy !== 0) {
      const speed = 70 * dt
      this.sim.setTarget(player.targetX + dx * speed, player.targetY + dy * speed)
    }
  }

  // ---------------------------------------------------------------------- frame

  private frame = (now: number): void => {
    const dt = Math.min(0.08, Math.max(0.0005, (now - this.last) / 1000))
    this.last = now
    this.updateKeys(dt)

    if (this.sim && !this.paused) {
      this.accumulator += dt
      let steps = 0
      while (this.accumulator >= SIM_STEP && steps < 6 && this.sim.phase === 'active') {
        this.sim.step()
        this.accumulator -= SIM_STEP
        steps += 1
      }
      this.dronePeak = Math.max(this.dronePeak, this.sim.drones.length)
      if (this.sim.events.length > 0) {
        this.renderer.consume(this.sim.events)
        this.playEvents()
        this.sim.events.length = 0
      }
      this.ui.updateHud(this.sim.snapshot())
      if (!this.resultShown && this.sim.phase !== 'active') this.finish()
    }

    this.renderer.render(dt)
    requestAnimationFrame(this.frame)
  }

  private playEvents(): void {
    const sim = this.sim
    if (!sim) return
    const now = performance.now()
    if (now - this.lastSound < 50) return
    this.lastSound = now
    const has = (type: string): boolean => sim.events.some((event) => event.type === type)
    if (has('death') || has('lose')) audio.play('death')
    else if (has('explode')) audio.play('explode')
    else if (has('pickup')) audio.play('pickup')
    else if (has('hit')) audio.play('hit')
    else if (has('shot')) audio.play('shoot')
  }

  private finish(): void {
    const sim = this.sim
    const mission = this.mission
    if (!sim || !mission) return
    this.resultShown = true
    const won = sim.phase === 'victory'
    const stats = sim.stats()
    const stars = won ? Math.max(1, starsFor(sim.score, mission)) : 0
    const credits = won ? Math.round(sim.credits * 0.35) + 40 : Math.round(sim.credits * 0.12)
    this.driverKills += stats.kills
    this.save.totalKills += stats.kills

    let result: MissionResult
    if (won && this.mode === 'campaign') {
      result = recordMission(this.save, mission, sim.score, stars, credits)
    } else {
      if (won) this.save.credits += credits
      result = { mission, score: won ? sim.score : stats.score, stars, credits, newBest: false, newStars: false }
    }

    if (this.mode === 'daily') {
      const key = todayKey()
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const streak = this.save.daily.date === key ? this.save.daily.streak : this.save.daily.date === yesterday ? this.save.daily.streak + 1 : 1
      this.save.daily = { date: key, score: Math.max(this.save.daily.score, sim.score), done: true, streak: won ? streak : this.save.daily.streak }
    }
    if (this.mode === 'endless' && won) this.save.endlessBest = Math.max(this.save.endlessBest, this.stage + 1)
    if (this.mode === 'arcade') this.save.arcadeBest = Math.max(this.save.arcadeBest, won ? sim.score : 0)
    if (this.mode === 'bossrush') {
      this.save.bossRushBest = Math.max(this.save.bossRushBest, won ? this.round : this.round - 1)
    }

    this.evaluateAchievements(won, stars)
    writeSave(this.save)
    this.ui.setSave(this.save)
    audio.play(won ? 'win' : 'lose')
    const reason = sim.events.find((event) => event.type === 'lose')?.color ?? undefined
    this.ui.showResult(result, this.mode, won, { kills: stats.kills, accuracy: stats.accuracy, damageTaken: stats.damageTaken }, reason)
  }

  private evaluateAchievements(won: boolean, stars: number): void {
    const unlocked = new Set(this.save.achievements)
    const grant = (id: string): void => {
      if (unlocked.has(id)) return
      unlocked.add(id)
      const meta = ACHIEVEMENTS.find((entry) => entry.id === id)
      if (meta) {
        this.save.credits += 150
        this.ui.toast(`Award unlocked: ${meta.name} (+150 ¤)`)
      }
    }
    const cleared = clearedCount(this.save)
    if (cleared >= 1) grant('first-contact')
    if (cleared >= 10) grant('squadron-rookie')
    if (this.save.totalKills >= 250) grant('alien-hunter')
    if (won && this.sim && this.sim.damageTaken === 0) grant('shield-master')
    if (this.save.secondaryUsed.length >= 5) grant('missile-commander')
    if (this.dronePeak >= 2) grant('drone-specialist')
    if (won && this.mission?.objective.kind === 'boss') grant('boss-breaker')
    for (let sector = 1; sector <= 10; sector += 1) {
      if (sectorProgress(this.save, sector).cleared >= CAMPAIGN.missionsPerSector) grant('sector-liberator')
    }
    if (cleared >= 100) grant('missions-100')
    if (cleared >= 200) grant('missions-200')
    if (cleared >= 300) grant('missions-300')
    if (this.save.endlessBest >= 10) grant('endless-survivor')
    if (stars === 3 && this.mission?.sector === 10) grant('starfall-legend')
    if (this.save.ships.length >= 5) grant('hangar-collector')
    if (this.save.daily.done) grant('daily-habit')
    if (this.save.bossRushBest >= 3) grant('rush-hour')
    this.save.achievements = [...unlocked]
  }

  // ---------------------------------------------------------------------- debug

  debugState(): Record<string, unknown> | null {
    if (!this.sim) return null
    return {
      ...this.sim.snapshot(),
      mission: this.mission?.id ?? null,
      mode: this.mode,
      enemies: this.sim.enemies.length,
      bullets: this.sim.bullets.length,
      paused: this.paused,
      playerX: Math.round(this.sim.player.x * 10) / 10,
      playerY: Math.round(this.sim.player.y * 10) / 10,
      kills: this.sim.kills,
      damageTaken: Math.round(this.sim.damageTaken),
    }
  }

  debugWin(): void {
    this.sim?.grantVictory()
  }

  debugGrant(id: EffectId): void {
    this.sim?.grantPowerup(id)
  }
}

interface DebugApi {
  state(): Record<string, unknown> | null
  start(index: number): void
  win(): void
  grant(id: EffectId): void
  pause(): void
  resume(): void
  menu(): void
  secondary(): void
  bomb(): void
  ability(): void
}

const app = new App()

const debug: DebugApi = {
  state: () => app.debugState(),
  start: (index) => app.startMission(index),
  win: () => app.debugWin(),
  grant: (id) => app.debugGrant(id),
  pause: () => app.pause(),
  resume: () => app.resume(),
  menu: () => app.quit(),
  secondary: () => app.secondary(),
  bomb: () => app.bomb(),
  ability: () => app.ability(),
}

;(window as unknown as { __ss?: DebugApi }).__ss = debug
