import { FIELD } from './constants'

export interface FieldFrame {
  halfWidth: number
  halfHeight: number
}

/**
 * Orthographic framing for the combat arena.
 *
 * The playfield is 100 × 178. Fitting only its width crops the bottom of the
 * field (the player's own lane) as soon as the viewport is wider than the field
 * is tall — a laptop window, a tablet, or the arcade's iframe on desktop. This
 * fits whichever axis is binding instead, so the whole field is always inside
 * the frustum and the view keeps the screen's aspect ratio (no distortion).
 */
export function frameField(width: number, height: number, widthPad = 1.08): FieldFrame {
  const safeWidth = Math.max(1, width)
  const safeHeight = Math.max(1, height)
  const aspect = safeWidth / safeHeight
  const fieldHalfWidth = FIELD.halfWidth * widthPad
  const fieldHalfHeight = FIELD.halfHeight

  // Wider than the field: height is the constraint, so widen horizontally.
  if (aspect >= fieldHalfWidth / fieldHalfHeight) {
    return { halfWidth: fieldHalfHeight * aspect, halfHeight: fieldHalfHeight }
  }
  // Taller than the field: width is the constraint, so extend vertically.
  return { halfWidth: fieldHalfWidth, halfHeight: fieldHalfWidth / aspect }
}
