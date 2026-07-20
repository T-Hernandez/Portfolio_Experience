import type { InteractiveObjectId } from '../state/useExperienceStore'

/**
 * Posiciones y encuadres estimados visualmente a partir de
 * design/reference/initial-camera-angle.png. Son aproximaciones para
 * trabajar con geometría placeholder — deben recalibrarse contra las
 * coordenadas reales una vez exista public/models/room.glb.
 */

export const CAMERA_DEFAULT = {
  position: [0.4, 1.55, 2.6] as [number, number, number],
  lookAt: [0.1, 1.05, -2.5] as [number, number, number],
  fov: 45,
}

export const CAMERA_FOCUS: Record<
  InteractiveObjectId,
  { position: [number, number, number]; lookAt: [number, number, number] }
> = {
  bookshelf: { position: [-1.9, 1.35, -0.9], lookAt: [-2.6, 1.0, -2.5] },
  laptop: { position: [-0.5, 1.2, -0.6], lookAt: [-0.6, 1.05, -2.2] },
  turntable: { position: [0.75, 1.2, -0.7], lookAt: [0.6, 1.0, -2.2] },
  plant: { position: [2.35, 1.3, -0.9], lookAt: [2.6, 0.9, -2.3] },
}

export const OBJECT_POSITIONS: Record<InteractiveObjectId, [number, number, number]> = {
  bookshelf: [-2.6, 0, -2.7],
  laptop: [-0.6, 0.92, -2.28],
  turntable: [0.6, 0.92, -2.28],
  plant: [2.6, 0, -2.3],
}
