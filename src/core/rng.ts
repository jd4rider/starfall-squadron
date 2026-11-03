/**
 * Deterministic seeded randomness. Every generated mission, formation and
 * drop table draws from one of these so the same seed always produces the
 * same battle, which is what makes campaign validation meaningful.
 */

export type Rng = () => number

/** mulberry32: small, fast, and stable across engines. */
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashSeed(text: string): number {
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function between(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min)
}

export function intBetween(rng: Rng, min: number, max: number): number {
  return Math.floor(between(rng, min, max + 1 - Number.EPSILON))
}

export function pick<T>(rng: Rng, list: readonly T[]): T {
  if (list.length === 0) throw new Error('pick() needs a non-empty list')
  return list[Math.min(list.length - 1, Math.floor(rng() * list.length))] as T
}

export function shuffle<T>(rng: Rng, list: readonly T[]): T[] {
  const copy = [...list]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1))
    const a = copy[index] as T
    copy[index] = copy[swap] as T
    copy[swap] = a
  }
  return copy
}

/** Weighted pick from `[value, weight]` pairs. */
export function weighted<T>(rng: Rng, entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((sum, [, weight]) => sum + Math.max(0, weight), 0)
  let roll = rng() * total
  for (const [value, weight] of entries) {
    roll -= Math.max(0, weight)
    if (roll <= 0) return value
  }
  return entries[entries.length - 1]![0]
}
