/**
 * DOM interface: menu, sector map, mission grid, hangar, settings and the
 * in-game HUD. All screens are plain HTML over the WebGL canvas so text stays
 * crisp and accessible on phones.
 */
import { CAMPAIGN } from '../core/constants'
import type { MissionDefinition, PersistedGame } from '../core/types'
import { SECTORS, sectorById } from '../content/sectors'
import { SHIPS, SHIP_BY_ID, COSMETICS } from '../content/ships'
import { WEAPONS, SECONDARIES } from '../content/weapons'
import { POWERUPS } from '../content/powerups'
import { CHALLENGES, type ChallengeId } from '../levels/generate'
import type { Snapshot } from '../sim/combat'
import type { MissionResult } from '../platform/save'
import {
  ACHIEVEMENTS,
  clearedCount,
  isMissionUnlocked,
  isSectorUnlocked,
  sectorProgress,
  totalStars,
} from '../platform/save'

export type ModeId = 'campaign' | 'endless' | 'bossrush' | 'daily' | 'arcade' | 'zen' | 'challenge'

export interface UIHandlers {
  continueCampaign(): void
  openSectors(): void
  openMissions(sector: number): void
  startMission(index: number): void
  startMode(mode: ModeId): void
  startChallenge(id: ChallengeId): void
  pause(): void
  resume(): void
  restart(): void
  quit(): void
  nextMission(): void
  retry(): void
  secondary(): void
  bomb(): void
  ability(): void
  buyShip(id: string): void
  equipShip(id: string): void
  buyWeapon(id: string): void
  equipWeapon(id: string): void
  equipSecondary(id: string): void
  buyCosmetic(id: string): void
  equipCosmetic(id: string): void
  setting(key: string, value: string | boolean | number): void
  eraseProgress(): void
  share(): void
}

type Screen = 'menu' | 'sectors' | 'missions' | 'hangar' | 'settings' | 'achievements' | 'challenges' | 'game'

const STAR = '★'
const stars = (value: number): string => `${STAR.repeat(Math.max(0, Math.min(3, value)))}<span class="dim">${STAR.repeat(Math.max(0, 3 - value))}</span>`

const modeBlurb: Record<ModeId, string> = {
  campaign: '300 missions',
  endless: 'climb forever',
  bossrush: 'ten flagships',
  daily: 'one shared sky',
  arcade: 'pure score',
  zen: 'no pressure',
  challenge: 'rules attached',
}

export class UI {
  private readonly root: HTMLElement
  private readonly handlers: UIHandlers
  private save: PersistedGame
  private screen: Screen = 'menu'
  private mission: MissionDefinition | null = null
  private hud: {
    score: HTMLElement
    hull: HTMLElement
    shield: HTMLElement
    hullText: HTMLElement
    shieldText: HTMLElement
    objective: HTMLElement
    progress: HTMLElement
    progressFill: HTMLElement
    weapon: HTMLElement
    lives: HTMLElement
    combo: HTMLElement
    effects: HTMLElement
    boss: HTMLElement
    bossName: HTMLElement
    bossWrap: HTMLElement
    bossParts: HTMLElement
    bombs: HTMLElement
    secondary: HTMLElement
    ability: HTMLElement
    station: HTMLElement
  } | null = null
  private overlay: HTMLElement | null = null
  private lastEffects = ''
  private lastScore = -1
  private toastTimer: number | null = null

  constructor(root: HTMLElement, save: PersistedGame, handlers: UIHandlers) {
    this.root = root
    this.save = save
    this.handlers = handlers
    this.root.addEventListener('click', (event) => this.onClick(event))
  }

  setSave(save: PersistedGame): void {
    this.save = save
    this.refreshCredits()
  }

  private onClick(event: Event): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]')
    if (!target) return
    const action = target.dataset.action ?? ''
    const value = target.dataset.value ?? ''
    if (target.hasAttribute('data-disabled')) return
    switch (action) {
      case 'continue':
        this.handlers.continueCampaign()
        break
      case 'sectors':
        this.handlers.openSectors()
        break
      case 'sector':
        this.handlers.openMissions(Number(value))
        break
      case 'mission':
        this.handlers.startMission(Number(value))
        break
      case 'mode':
        this.handlers.startMode(value as ModeId)
        break
      case 'challenge':
        this.handlers.startChallenge(value as ChallengeId)
        break
      case 'challenges-screen':
        this.showChallenges()
        break
      case 'hangar':
        this.showHangar()
        break
      case 'settings':
        this.showSettings()
        break
      case 'achievements':
        this.showAchievements()
        break
      case 'menu':
        this.handlers.quit()
        break
      case 'back-sectors':
        this.handlers.openSectors()
        break
      case 'pause':
        this.handlers.pause()
        break
      case 'resume':
        this.handlers.resume()
        break
      case 'restart':
        this.handlers.restart()
        break
      case 'retry':
        this.handlers.retry()
        break
      case 'next':
        this.handlers.nextMission()
        break
      case 'secondary':
        this.handlers.secondary()
        break
      case 'bomb':
        this.handlers.bomb()
        break
      case 'ability':
        this.handlers.ability()
        break
      case 'buy-ship':
        this.handlers.buyShip(value)
        break
      case 'equip-ship':
        this.handlers.equipShip(value)
        break
      case 'buy-weapon':
        this.handlers.buyWeapon(value)
        break
      case 'equip-weapon':
        this.handlers.equipWeapon(value)
        break
      case 'equip-secondary':
        this.handlers.equipSecondary(value)
        break
      case 'buy-cosmetic':
        this.handlers.buyCosmetic(value)
        break
      case 'equip-cosmetic':
        this.handlers.equipCosmetic(value)
        break
      case 'setting':
        this.toggleSetting(value)
        break
      case 'quality':
        this.handlers.setting('quality', value)
        break
      case 'control':
        this.handlers.setting('control', value)
        break
      case 'erase':
        if (window.confirm('Erase all Starfall Squadron progress on this device?')) this.handlers.eraseProgress()
        break
      case 'share':
        this.handlers.share()
        break
    }
  }

  private toggleSetting(key: string): void {
    const settings = this.save.settings as unknown as Record<string, unknown>
    const current = settings[key]
    if (typeof current === 'boolean') this.handlers.setting(key, !current)
  }

  // ------------------------------------------------------------------- screens

  private shell(content: string, className = ''): void {
    this.root.innerHTML = `<div class="screen ${className}"><div class="screen-inner">${content}</div></div>`
  }

  showMenu(): void {
    this.screen = 'menu'
    this.overlay = null
    const cleared = clearedCount(this.save)
    const continueIndex = Math.max(1, Math.min(CAMPAIGN.missions, this.save.lastMission))
    const modes: ModeId[] = ['endless', 'bossrush', 'daily', 'arcade', 'zen']
    this.shell(
      `
      <div class="menu-hero">
        <p class="eyebrow">LITTLE JOY ARCADE</p>
        <h1 class="title">STARFALL<span>SQUADRON</span></h1>
        <p class="tagline">Fly ten fighters. Break ten flagships. Hold the last sky.</p>
      </div>
      <div class="menu-stats">
        <span><b>${cleared}</b> / 300 missions</span>
        <span><b>${totalStars(this.save)}</b> stars</span>
        <span><b class="credits">${this.save.credits.toLocaleString()}</b> credits</span>
      </div>
      <div class="menu-actions">
        <button class="btn big primary" data-action="continue">
          <span>CONTINUE</span>
          <small>Mission ${continueIndex} · ${this.save.progress[continueIndex]?.cleared ? 'replay' : 'next sortie'}</small>
        </button>
        <button class="btn" data-action="sectors"><b>CAMPAIGN</b><small>10 sectors · 300 missions</small></button>
      </div>
      <div class="mode-grid">
        ${modes
          .map(
            (mode) => `
          <button class="btn mode" data-action="mode" data-value="${mode}">
            <b>${mode === 'bossrush' ? 'BOSS RUSH' : mode === 'arcade' ? 'ARCADE CLASSIC' : mode === 'zen' ? 'ZEN PATROL' : mode === 'daily' ? 'DAILY' : 'ENDLESS'}</b>
            <small>${modeBlurb[mode]}</small>
          </button>`,
          )
          .join('')}
        <button class="btn mode" data-action="challenges-screen"><b>CHALLENGES</b><small>10 rule sets</small></button>
      </div>
      <div class="menu-row">
        <button class="btn ghost" data-action="hangar">HANGAR</button>
        <button class="btn ghost" data-action="settings">SETTINGS</button>
        <button class="btn ghost" data-action="achievements">AWARDS</button>
      </div>
      <p class="footnote">Best ship: ${SHIP_BY_ID.get(this.save.ship)?.name ?? 'Falcon'} · Drag anywhere below the HUD to fly. Guns fire themselves.</p>
    `,
      'menu',
    )
  }

  showSectors(): void {
    this.screen = 'sectors'
    this.root.innerHTML = `
      <div class="screen sectors">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>CAMPAIGN</h2>
            <span class="muted">${clearedCount(this.save)} / 300</span>
          </header>
          <div class="sector-grid">
            ${SECTORS.map((sector) => {
              const unlocked = isSectorUnlocked(this.save, sector.id)
              const progress = sectorProgress(this.save, sector.id)
              return `
                <button class="sector-card ${unlocked ? '' : 'locked'}" data-action="sector" data-value="${sector.id}" ${unlocked ? '' : 'data-disabled'}>
                  <span class="sector-art" style="--a:${sector.palette.nebula};--b:${sector.palette.accent}">
                    <span class="sector-num">${String(sector.id).padStart(2, '0')}</span>
                  </span>
                  <span class="sector-body">
                    <b>${sector.name}</b>
                    <small>${unlocked ? sector.subtitle : 'Clear the previous sector flagship'}</small>
                    <span class="sector-bar"><i style="width:${Math.round((progress.cleared / 30) * 100)}%"></i></span>
                    <small class="muted">${progress.cleared}/30 · ${progress.stars}★</small>
                  </span>
                  ${unlocked ? '' : '<span class="lock">LOCKED</span>'}
                </button>`
            }).join('')}
          </div>
        </div>
      </div>`
  }

  showMissions(sector: number): void {
    this.screen = 'missions'
    const spec = sectorById(sector)
    const first = (sector - 1) * CAMPAIGN.missionsPerSector + 1
    const tiles: string[] = []
    for (let local = 1; local <= CAMPAIGN.missionsPerSector; local += 1) {
      const index = first + local - 1
      const unlocked = isMissionUnlocked(this.save, index)
      const entry = this.save.progress[index]
      const boss = local === CAMPAIGN.missionsPerSector
      tiles.push(`
        <button class="mission-tile ${unlocked ? '' : 'locked'} ${boss ? 'boss' : ''}" data-action="mission" data-value="${index}" ${unlocked ? '' : 'data-disabled'}>
          <span class="num">${local}</span>
          <span class="tile-stars">${stars(entry?.stars ?? 0)}</span>
          ${boss ? '<span class="boss-mark">FLAGSHIP</span>' : ''}
        </button>`)
    }
    this.root.innerHTML = `
      <div class="screen missions">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="back-sectors">← SECTORS</button>
            <h2>${spec.name}</h2>
            <span class="muted">${sectorProgress(this.save, sector).cleared}/30</span>
          </header>
          <div class="mission-grid">${tiles.join('')}</div>
        </div>
      </div>`
  }

  showChallenges(): void {
    this.screen = 'challenges'
    this.root.innerHTML = `
      <div class="screen">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>CHALLENGES</h2>
            <span class="muted">${CHALLENGES.length}</span>
          </header>
          <div class="list">
            ${CHALLENGES.map(
              (challenge) => `
              <button class="row" data-action="challenge" data-value="${challenge.id}">
                <span><b>${challenge.name}</b><small>${challenge.blurb}</small></span>
                <span class="chev">›</span>
              </button>`,
            ).join('')}
          </div>
        </div>
      </div>`
  }

  showHangar(): void {
    this.screen = 'hangar'
    const ship = SHIP_BY_ID.get(this.save.ship) ?? SHIPS[0]!
    this.root.innerHTML = `
      <div class="screen hangar">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>HANGAR</h2>
            <span class="muted credits">${this.save.credits.toLocaleString()} ¤</span>
          </header>
          <section class="panel">
            <p class="eyebrow">SELECTED</p>
            <h3>${ship.name}</h3>
            <p class="muted">${ship.blurb}</p>
            <div class="stat-row">
              ${this.stat('Hull', ship.hull, 180)}
              ${this.stat('Shield', ship.shield, 180)}
              ${this.stat('Speed', ship.speed, 90)}
              ${this.stat('Damage', ship.damage * 100, 170)}
            </div>
            <p class="ability-line"><b>${ship.abilityName}</b> · ${ship.abilityBlurb}</p>
          </section>
          <p class="eyebrow section-title">SHIPS</p>
          <div class="list">
            ${SHIPS.map((entry) => {
              const owned = this.save.ships.includes(entry.id)
              const equipped = this.save.ship === entry.id
              return `
                <div class="row ship-row">
                  <span class="ship-swatch" style="--h:${entry.hullColor};--a:${entry.accentColor}"></span>
                  <span class="grow">
                    <b>${entry.name}</b>
                    <small>${entry.className} · ${entry.abilityName}</small>
                  </span>
                  ${
                    equipped
                      ? '<span class="pill">EQUIPPED</span>'
                      : owned
                        ? `<button class="btn tiny" data-action="equip-ship" data-value="${entry.id}">EQUIP</button>`
                        : `<button class="btn tiny ${this.save.credits >= entry.cost ? '' : 'disabled'}" data-action="buy-ship" data-value="${entry.id}">${entry.cost.toLocaleString()} ¤</button>`
                  }
                </div>`
            }).join('')}
          </div>
          <p class="eyebrow section-title">PRIMARY WEAPONS</p>
          <div class="list">
            ${WEAPONS.map((weapon) => {
              const level = this.save.weapons[weapon.id] ?? 1
              const equipped = this.save.primary === weapon.id
              return `
                <div class="row">
                  <span class="grow">
                    <b style="color:${weapon.color}">${weapon.name}</b>
                    <small>Level ${level} / 5 · ${weapon.blurb}</small>
                  </span>
                  ${
                    equipped
                      ? `<span class="pill">EQUIPPED</span><button class="btn tiny" data-action="buy-weapon" data-value="${weapon.id}" ${level >= 5 ? 'data-disabled' : ''}>${level >= 5 ? 'MAX' : `UP ${350 * level} ¤`}</button>`
                      : `<button class="btn tiny" data-action="equip-weapon" data-value="${weapon.id}">EQUIP</button>`
                  }
                </div>`
            }).join('')}
          </div>
          <p class="eyebrow section-title">SECONDARY</p>
          <div class="list">
            ${SECONDARIES.map(
              (entry) => `
              <div class="row">
                <span class="grow"><b>${entry.name}</b><small>${entry.blurb}</small></span>
                ${
                  this.save.secondary === entry.id
                    ? '<span class="pill">EQUIPPED</span>'
                    : `<button class="btn tiny" data-action="equip-secondary" data-value="${entry.id}">EQUIP</button>`
                }
              </div>`,
            ).join('')}
          </div>
          <p class="eyebrow section-title">TRAILS</p>
          <div class="list">
            ${COSMETICS.map((entry) => {
              const owned = this.save.cosmetics.trails.includes(entry.id)
              return `
                <div class="row">
                  <span class="ship-swatch" style="--h:${entry.color};--a:${entry.color}"></span>
                  <span class="grow"><b>${entry.name}</b><small>${entry.trail ? 'Engine trail' : 'Default'}</small></span>
                  ${
                    this.save.cosmetics.trail === entry.id
                      ? '<span class="pill">IN USE</span>'
                      : owned
                        ? `<button class="btn tiny" data-action="equip-cosmetic" data-value="${entry.id}">USE</button>`
                        : `<button class="btn tiny" data-action="buy-cosmetic" data-value="${entry.id}">${entry.cost} ¤</button>`
                  }
                </div>`
            }).join('')}
          </div>
        </div>
      </div>`
  }

  private stat(label: string, value: number, max: number): string {
    return `<div class="stat"><span>${label}</span><span class="stat-bar"><i style="width:${Math.min(100, (value / max) * 100)}%"></i></span></div>`
  }

  showSettings(): void {
    this.screen = 'settings'
    const settings = this.save.settings
    const toggle = (key: string, label: string, on: boolean): string => `
      <button class="row" data-action="setting" data-value="${key}">
        <span><b>${label}</b></span>
        <span class="switch ${on ? 'on' : ''}"><i></i></span>
      </button>`
    this.root.innerHTML = `
      <div class="screen">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>SETTINGS</h2>
            <span></span>
          </header>
          <div class="list">
            ${toggle('sound', 'Sound effects', settings.sound)}
            ${toggle('music', 'Music', settings.music)}
            ${toggle('motion', 'Screen shake and motion', settings.motion)}
            ${toggle('highContrast', 'High-contrast projectiles', settings.highContrast)}
            ${toggle('leftHanded', 'Left-handed layout', settings.leftHanded)}
          </div>
          <p class="eyebrow section-title">GRAPHICS</p>
          <div class="segmented">
            ${(['low', 'medium', 'high'] as const)
              .map((quality) => `<button class="${settings.quality === quality ? 'on' : ''}" data-action="quality" data-value="${quality}">${quality.toUpperCase()}</button>`)
              .join('')}
          </div>
          <p class="eyebrow section-title">CONTROLS</p>
          <div class="segmented">
            <button class="${settings.control === 'absolute' ? 'on' : ''}" data-action="control" data-value="absolute">FOLLOW FINGER</button>
            <button class="${settings.control === 'relative' ? 'on' : ''}" data-action="control" data-value="relative">RELATIVE DRAG</button>
          </div>
          <p class="eyebrow section-title">DATA</p>
          <button class="row danger" data-action="erase"><span><b>Erase progress</b><small>Wipes campaign, credits and unlocks on this device.</small></span><span class="chev">›</span></button>
          <p class="footnote">Starfall Squadron · v1.0.0 · a Little Joy Arcade original</p>
        </div>
      </div>`
  }

  showAchievements(): void {
    this.screen = 'achievements'
    this.root.innerHTML = `
      <div class="screen">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>AWARDS</h2>
            <span class="muted">${this.save.achievements.length}/${ACHIEVEMENTS.length}</span>
          </header>
          <div class="list">
            ${ACHIEVEMENTS.map((achievement) => {
              const unlocked = this.save.achievements.includes(achievement.id)
              return `<div class="row ${unlocked ? '' : 'locked'}">
                <span class="award ${unlocked ? 'on' : ''}">★</span>
                <span class="grow"><b>${achievement.name}</b><small>${achievement.blurb}</small></span>
                <span class="pill ${unlocked ? 'gold' : ''}">${unlocked ? 'EARNED' : '—'}</span>
              </div>`
            }).join('')}
          </div>
        </div>
      </div>`
  }

  // ----------------------------------------------------------------------- HUD

  showGame(mission: MissionDefinition): void {
    this.screen = 'game'
    this.mission = mission
    this.overlay = null
    this.lastEffects = ''
    this.lastScore = -1
    this.root.innerHTML = `
      <div id="hud" class="hud">
        <div class="hud-top">
          <div class="hud-left">
            <span class="hud-mission">M${String(mission.index).padStart(3, '0')} · ${mission.name}</span>
            <span class="hud-score" data-hud="score">0</span>
          </div>
          <div class="hud-bars">
            <div class="bar hull"><i data-hud="hullfill"></i><span data-hud="hulltext">100</span></div>
            <div class="bar shield"><i data-hud="shieldfill"></i><span data-hud="shieldtext">60</span></div>
          </div>
          <button class="icon-btn" data-action="pause" aria-label="Pause">II</button>
        </div>
        <div class="hud-objective">
          <span data-hud="objective">${mission.objective.label}</span>
          <span class="objective-progress"><i data-hud="progressfill"></i></span>
          <span data-hud="progresstext">0/${mission.objective.target}</span>
        </div>
        <div class="hud-boss" data-hud="bosswrap" hidden>
          <div class="boss-line"><span data-hud="bossname"></span><span data-hud="bossparts"></span></div>
          <div class="boss-bar"><i data-hud="bossfill"></i></div>
        </div>
        <div class="hud-effects" data-hud="effects"></div>
        <div class="hud-station" data-hud="station" hidden></div>
        <div class="hud-bottom">
          <div class="hud-weapon">
            <span data-hud="weapon">PULSE CANNON</span>
            <span data-hud="combo" class="combo"></span>
          </div>
          <div class="hud-actions">
            <button class="action-btn" data-action="secondary"><b>${this.secondaryGlyph()}</b><small data-hud="secondary">MISSILES</small></button>
            <button class="action-btn bomb" data-action="bomb"><b>✸</b><small data-hud="bombs">1</small></button>
            <button class="action-btn ability" data-action="ability"><b>✦</b><small data-hud="ability">READY</small></button>
          </div>
          <span class="hud-lives" data-hud="lives">♥♥♥</span>
        </div>
      </div>`
    const query = <T extends HTMLElement>(key: string): T => {
      const element = this.root.querySelector<T>(`[data-hud="${key}"]`)
      if (!element) throw new Error(`missing HUD element ${key}`)
      return element
    }
    this.hud = {
      score: query('score'),
      hull: query('hullfill'),
      shield: query('shieldfill'),
      hullText: query('hulltext'),
      shieldText: query('shieldtext'),
      objective: query('objective'),
      progress: query('progresstext'),
      progressFill: query('progressfill'),
      weapon: query('weapon'),
      lives: query('lives'),
      combo: query('combo'),
      effects: query('effects'),
      boss: query('bossfill'),
      bossName: query('bossname'),
      bossWrap: query('bosswrap'),
      bossParts: query('bossparts'),
      secondary: query('secondary'),
      bombs: query('bombs'),
      ability: query('ability'),
      station: query('station'),
    }
  }

  private secondaryGlyph(): string {
    return '➤'
  }

  private hudEl(key: string): HTMLElement | null {
    return this.root.querySelector<HTMLElement>(`[data-hud="${key}"]`)
  }

  updateHud(snapshot: Snapshot): void {
    if (!this.hud) return
    if (snapshot.score !== this.lastScore) {
      this.hud.score.textContent = snapshot.score.toLocaleString()
      this.lastScore = snapshot.score
    }
    const hullRatio = Math.max(0, snapshot.hull / snapshot.maxHull)
    this.hud.hull.style.width = `${hullRatio * 100}%`
    this.hud.hull.classList.toggle('low', hullRatio < 0.3)
    this.hud.hullText.textContent = `${snapshot.hull}`
    this.hud.shield.style.width = `${snapshot.maxShield > 0 ? Math.max(0, (snapshot.shield / snapshot.maxShield) * 100) : 0}%`
    this.hud.shieldText.textContent = `${snapshot.shield}`
    this.hud.objective.textContent = snapshot.objective.label
    this.hud.progress.textContent = `${Math.min(snapshot.progress, snapshot.progressTarget)}/${snapshot.progressTarget}`
    this.hud.progressFill.style.width = `${Math.min(100, (snapshot.progress / Math.max(1, snapshot.progressTarget)) * 100)}%`
    this.hud.weapon.textContent = `${snapshot.weapon.toUpperCase()} · ${snapshot.weaponLevel}`
    this.hud.lives.textContent = '♥'.repeat(Math.max(0, snapshot.lives))
    this.hud.combo.textContent = snapshot.combo >= 3 ? `×${snapshot.combo}` : ''
    const secondaryText = this.hudEl('secondary')
    if (secondaryText) secondaryText.textContent = `${snapshot.secondaryCharges}`
    const bombs = this.hudEl('bombs')
    if (bombs) bombs.textContent = `${snapshot.bombs}`
    const ability = this.hudEl('ability')
    if (ability) {
      ability.textContent = snapshot.abilityReady >= 1 ? 'READY' : `${Math.round(snapshot.abilityReady * 100)}%`
      ability.classList.toggle('ready', snapshot.abilityReady >= 1)
    }

    const bossWrap = this.hudEl('bosswrap')
    if (bossWrap) bossWrap.hidden = !snapshot.boss
    if (snapshot.boss) {
      this.hud.boss.style.width = `${Math.max(0, (snapshot.boss.hp / snapshot.boss.maxHp) * 100)}%`
      this.hud.bossName.textContent = snapshot.boss.name
      const parts = this.hudEl('bossparts')
      if (parts) parts.textContent = `${snapshot.boss.parts} TURRETS · PHASE ${snapshot.boss.phase + 1}`
    }
    const station = this.hudEl('station')
    if (station) {
      station.hidden = !snapshot.station
      if (snapshot.station) station.textContent = `${snapshot.station.kind === 'relay' ? 'RELAY' : 'COURIER'} ${snapshot.station.hp}/${snapshot.station.maxHp}`
    }

    const signature = snapshot.effects.map((effect) => `${effect.id}:${Math.ceil(effect.remaining)}`).join('|')
    if (signature !== this.lastEffects) {
      this.lastEffects = signature
      this.hud.effects.innerHTML = snapshot.effects
        .slice(0, 7)
        .map((effect) => {
          const spec = POWERUPS.find((powerup) => powerup.id === effect.id)
          return `<span class="effect-chip" style="--c:${spec?.color ?? '#4de1ff'}"><b>${effect.glyph}</b>${Math.ceil(effect.remaining)}s</span>`
        })
        .join('')
    }
  }

  // ------------------------------------------------------------------ overlays

  showPause(): void {
    this.closeOverlay()
    const sheet = document.createElement('div')
    sheet.className = 'overlay'
    sheet.innerHTML = `
      <div class="sheet">
        <p class="eyebrow">PAUSED</p>
        <h2>Holding pattern</h2>
        <p class="muted">${this.mission?.name ?? 'Sortie'} · ${this.mission?.objective.label ?? ''}</p>
        <div class="sheet-actions">
          <button class="btn primary" data-action="resume"><b>RESUME</b></button>
          <button class="btn" data-action="restart"><b>RESTART</b></button>
          <button class="btn ghost" data-action="menu"><b>EXIT TO MENU</b></button>
        </div>
      </div>`
    this.root.appendChild(sheet)
    this.overlay = sheet
  }

  closeOverlay(): void {
    if (this.overlay) {
      this.overlay.remove()
      this.overlay = null
    }
  }

  showResult(result: MissionResult, mode: ModeId, won: boolean, stats: { kills: number; accuracy: number; damageTaken: number }, reason?: string): void {
    this.closeOverlay()
    this.screen = 'game'
    const mission = result.mission
    const nextIndex = Math.min(CAMPAIGN.missions, mission.index + 1)
    const nextUnlocked = isMissionUnlocked(this.save, nextIndex) && mission.index < CAMPAIGN.missions
    const sheet = document.createElement('div')
    sheet.className = 'overlay'
    sheet.innerHTML = `
      <div class="sheet result ${won ? 'win' : 'lose'}">
        <p class="eyebrow">${won ? 'MISSION COMPLETE' : 'SIGNAL LOST'}</p>
        <h2>${won ? mission.name : 'Sortie failed'}</h2>
        <div class="result-stars">${stars(won ? result.stars : 0)}</div>
        <div class="result-grid">
          <span>Score<b>${result.score.toLocaleString()}</b></span>
          <span>Kills<b>${stats.kills}</b></span>
          <span>Accuracy<b>${Math.round(stats.accuracy * 100)}%</b></span>
          <span>Credits<b>+${result.credits.toLocaleString()}</b></span>
        </div>
        ${won ? `<p class="muted">${result.newStars ? 'New star record. ' : ''}${result.newBest ? 'New personal best.' : ''}</p>` : `<p class="muted">${reason ?? 'The lane belongs to them for now.'}</p>`}
        <div class="sheet-actions">
          ${
            won && (mode === 'endless' || mode === 'bossrush' || (nextUnlocked && mode === 'campaign'))
              ? `<button class="btn primary" data-action="next"><b>${mode === 'endless' ? 'NEXT WAVE' : mode === 'bossrush' ? 'NEXT FLAGSHIP' : 'NEXT MISSION'}</b><small>${mode === 'campaign' ? `M${String(nextIndex).padStart(3, '0')}` : mode === 'bossrush' ? 'keep going' : 'it gets worse'}</small></button>`
              : won
                ? `<button class="btn primary" data-action="retry"><b>FLY AGAIN</b></button>`
                : `<button class="btn primary" data-action="retry"><b>RETRY</b></button>`
          }
          <button class="btn" data-action="menu"><b>HANGAR / MENU</b></button>
        </div>
        <p class="footnote">${won ? `Next star target: ${mission.starScore[Math.min(2, result.stars)]?.toLocaleString() ?? '—'}` : 'Your upgrades and unlocks are safe.'}</p>
      </div>`
    this.root.appendChild(sheet)
    this.overlay = sheet
  }

  toast(message: string): void {
    let element = this.root.querySelector<HTMLElement>('.toast')
    if (!element) {
      element = document.createElement('div')
      element.className = 'toast'
      this.root.appendChild(element)
    }
    element.textContent = message
    element.classList.add('show')
    if (this.toastTimer !== null) window.clearTimeout(this.toastTimer)
    this.toastTimer = window.setTimeout(() => element?.classList.remove('show'), 2200)
  }

  private refreshCredits(): void {
    const credits = this.root.querySelector('.credits')
    if (credits) credits.textContent = `${this.save.credits.toLocaleString()}`
  }

  get currentScreen(): Screen {
    return this.screen
  }
}
