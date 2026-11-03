export const SIM_STEP = 1 / 60

/** Logical playfield: 100 wide, 178 tall, matching a 9:16 portrait screen. */
export const FIELD = {
  width: 100,
  height: 178,
  halfWidth: 50,
  halfHeight: 89,
  playerMinY: 14,
  playerMaxY: 74,
  spawnY: 186,
  despawnY: -24,
}

export const CAMPAIGN = {
  sectors: 10,
  missionsPerSector: 30,
  missions: 300,
}

/** Hard caps that keep a wave from becoming a bullet-hell slideshow. */
export const LIMITS = {
  enemies: 64,
  playerBullets: 220,
  enemyBullets: 260,
  pickups: 24,
  particles: 900,
  drones: 3,
}

export const PLAYER = {
  lives: 3,
  respawnInvuln: 2.2,
  hullRegenDelay: 9,
}

export const QUALITY = {
  low: { stars: 320, particles: 160, pixelRatio: 1 },
  medium: { stars: 640, particles: 340, pixelRatio: 1.5 },
  high: { stars: 1100, particles: 620, pixelRatio: 2 },
} as const

export type QualityId = keyof typeof QUALITY
