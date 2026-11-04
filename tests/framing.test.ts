import { describe, expect, it } from 'vitest'
import { FIELD } from '../src/core/constants'
import { frameField } from '../src/core/framing'

const centerY = FIELD.height / 2

describe('combat arena framing', () => {
  const viewports = [
    ['phone 360x800', 360, 800],
    ['phone 390x844', 390, 844],
    ['tall phone 412x915', 412, 915],
    ['tablet portrait 768x1024', 768, 1024],
    ['laptop 1280x800', 1280, 800],
    ['arcade iframe 1440x700', 1440, 700],
    ['ultrawide 2560x900', 2560, 900],
    ['square 800x800', 800, 800],
  ] as const

  for (const [label, width, height] of viewports) {
    it(`keeps the whole playfield and the player lane visible at ${label}`, () => {
      const frame = frameField(width, height)
      const top = centerY + frame.halfHeight
      const bottom = centerY - frame.halfHeight
      // Nothing above the spawn line or below the floor may be cropped.
      expect(top).toBeGreaterThanOrEqual(FIELD.height)
      expect(bottom).toBeLessThanOrEqual(0)
      // The player's own lane must be comfortably inside the frustum.
      expect(bottom).toBeLessThan(FIELD.playerMinY - 5)
      expect(top).toBeGreaterThan(FIELD.playerMaxY + 5)
    })

    it(`keeps the view proportional to the screen at ${label}`, () => {
      const frame = frameField(width, height)
      expect(frame.halfWidth / frame.halfHeight).toBeCloseTo(width / height, 6)
    })
  }

  it('never crops the bottom when the viewport is wider than it is tall', () => {
    // The regression: width-only fitting put the camera's bottom edge above the
    // ship, so the ship sat below the visible arena entirely.
    const frame = frameField(1440, 700)
    const bottom = centerY - frame.halfHeight
    expect(bottom).toBeLessThanOrEqual(0)
    expect(FIELD.playerMinY).toBeGreaterThan(bottom)
  })

  it('still fits the full width on a portrait phone', () => {
    const frame = frameField(390, 844)
    expect(frame.halfWidth).toBeCloseTo(FIELD.halfWidth * 1.08, 6)
  })

  it('handles a degenerate zero-sized canvas without producing NaN', () => {
    const frame = frameField(0, 0)
    expect(Number.isFinite(frame.halfWidth)).toBe(true)
    expect(Number.isFinite(frame.halfHeight)).toBe(true)
  })
})
