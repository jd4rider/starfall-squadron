import { FIELD } from './constants'

export interface FieldFrame {
  centerX: number
  centerY: number
  halfWidth: number
  halfHeight: number
}

/** Pixel bands at the top and bottom of the arena that the HUD owns. */
export const HUD_INSET = { top: 78, bottom: 82 }

/**
 * Orthographic framing for the combat arena.
 *
 * The whole 100 × 178 playfield has to fit between the HUD bands: fitting only
 * its width crops the player's lane on wide windows, and filling the full canvas
 * height puts the fighter behind the bottom button row on short ones. The field
 * is scaled into the usable band, so the ship is always on screen and clear of
 * the controls, and the view keeps the screen's aspect ratio (no distortion).
 */
export function frameField(
  width: number,
  height: number,
  inset: { top: number; bottom: number } = HUD_INSET,
): FieldFrame {
  const w = Math.max(1, width)
  const h = Math.max(1, height)
  // On very short viewports the HUD bands have to shrink with the window.
  const top = Math.min(inset.top, h * 0.14)
  const bottom = Math.min(inset.bottom, h * 0.16)
  const usableHeight = Math.max(1, h - top - bottom)
  const usableWidth = w * 0.96

  const scale = Math.min(usableWidth / FIELD.width, usableHeight / FIELD.height)
  const halfWidth = w / (2 * scale)
  const halfHeight = h / (2 * scale)
  const bandCenter = top + usableHeight / 2

  return {
    centerX: 0,
    centerY: FIELD.halfHeight - (h / 2 - bandCenter) / scale,
    halfWidth,
    halfHeight,
  }
}
