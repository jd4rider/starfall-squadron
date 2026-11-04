import { describe, expect, it } from 'vitest'
import { FIELD } from '../src/core/constants'
import { HUD_INSET, frameField } from '../src/core/framing'

/** Pixels-per-world-unit for a frame, and where a world Y lands on screen. */
function projector(frame: ReturnType<typeof frameField>, height: number) {
  const scale = height / (2 * frame.halfHeight)
  return (worldY: number) => height / 2 - (worldY - frame.centerY) * scale
}

function insets(height: number) {
  return {
    top: Math.min(HUD_INSET.top, height * 0.14),
    bottom: Math.min(HUD_INSET.bottom, height * 0.16),
  }
}

describe('combat arena framing', () => {
  const viewports = [
    ['small phone 360x640', 360, 640],
    ['phone 390x844', 390, 844],
    ['tall phone 412x915', 412, 915],
    ['tablet portrait 768x1024', 768, 1024],
    ['tablet landscape 1024x768', 1024, 768],
    ['laptop 1280x800', 1280, 800],
    ['short laptop 1280x600', 1280, 600],
    ['arcade iframe 1440x700', 1440, 700],
    ['ultrawide 2560x900', 2560, 900],
    ['square 800x800', 800, 800],
  ] as const

  for (const [label, width, height] of viewports) {
    const frame = frameField(width, height)
    const screenY = projector(frame, height)
    const band = insets(height)

    it(`fits the whole playfield between the HUD bands at ${label}`, () => {
      // Nothing above the spawn line or below the riverbed may be cropped.
      expect(screenY(FIELD.height)).toBeGreaterThanOrEqual(band.top - 1)
      expect(screenY(0)).toBeLessThanOrEqual(height - band.bottom + 1)
    })

    it(`keeps the fighter clear of the bottom buttons at ${label}`, () => {
      // The bug: on short windows the ship lane sat behind the button row.
      expect(screenY(FIELD.playerMinY)).toBeLessThanOrEqual(height - band.bottom + 1)
      expect(screenY(FIELD.playerMaxY)).toBeGreaterThanOrEqual(band.top - 1)
    })

    it(`keeps the view proportional to the screen at ${label}`, () => {
      expect(frame.halfWidth / frame.halfHeight).toBeCloseTo(width / height, 6)
    })
  }

  it('shows the player lane on a short, wide window', () => {
    // 1280x600 with width-only fitting put the camera bottom at world y 62,
    // above the ship at 32 — the fighter existed but was never drawn on screen.
    const frame = frameField(1280, 600)
    const screenY = projector(frame, 600)
    expect(screenY(FIELD.playerMinY)).toBeLessThan(600)
    expect(screenY(FIELD.playerMaxY)).toBeGreaterThan(0)
  })

  it('centres the arena horizontally', () => {
    expect(frameField(1440, 700).centerX).toBe(0)
  })

  it('handles a degenerate zero-sized canvas without producing NaN', () => {
    const frame = frameField(0, 0)
    for (const value of [frame.centerX, frame.centerY, frame.halfWidth, frame.halfHeight]) {
      expect(Number.isFinite(value)).toBe(true)
    }
  })
})
