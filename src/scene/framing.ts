import type { InteractiveObjectId } from '../state/useExperienceStore'

/**
 * El .glb real no trae Empties Camera_* ni anchors de UI (decisión del
 * usuario: usar las capturas de referencia en design/reference/ en vez de
 * cámaras en Blender). El nombre del objeto sigue siendo el contrato — su
 * posición real se lee del modelo (Box3 del nodo resuelto por nombre) — pero
 * el ángulo/distancia de cada shot es una constante ajustada a mano contra
 * esas capturas, no un dato exportado.
 */

export const OBJECT_NODE_NAMES: Record<InteractiveObjectId, string> = {
  laptop: 'laptop',
  bookshelf: 'bookshelf',
  turntable: 'turntable',
  pokewalker: 'pokewalk',
}

interface CameraShot {
  /** offset de la cámara relativo al centro del Box3 del objeto */
  offset: [number, number, number]
  /** punto de mira, relativo al mismo centro */
  lookAtOffset: [number, number, number]
}

/**
 * Ajustados a ojo, iterando dev server + captura de pantalla contra cada
 * referencia — el objetivo era que el objeto llene el encuadre con una
 * composición agradable, no reproducir el ángulo exacto de Blender (no
 * hay dato de cámara real que reproducir; ver framing.ts arriba).
 */
export const CAMERA_FRAMING: Record<InteractiveObjectId, CameraShot> = {
  // Reference laptop.png — frontal, pantalla llenando el encuadre.
  laptop: { offset: [7, 0, 0], lookAtOffset: [0, -0.3, 0] },
  // Reference bookshelf.png — 3/4 angulado; offset.x grande a propósito:
  // el Box3 del librero es enorme (rotación del nodo infla el AABB) y un
  // offset chico deja la cámara METIDA en la geometría (pantalla gris lisa).
  bookshelf: { offset: [13, -2, 4], lookAtOffset: [0, -2, 0] },
  // Reference turntable.png — angulado desde arriba/costado.
  turntable: { offset: [6, 1.5, 2], lookAtOffset: [0, -0.3, 0] },
  // Reference pokewalker.png — cercano, bajo, con la planta detrás en cuadro.
  pokewalker: { offset: [5, 1, 2], lookAtOffset: [0, -0.2, 0] },
}

/** Vista general — tuneada contra "Reference general view.png". */
export const DEFAULT_CAMERA: CameraShot & { origin: [number, number, number] } = {
  origin: [-1, 5.6, -1],
  offset: [24, 1, 0],
  lookAtOffset: [-2, -0.5, 0],
}

/** Offset del panel de UI relativo al centro del Box3 del objeto. */
export const UI_OFFSET: Record<InteractiveObjectId, [number, number, number]> = {
  laptop: [0, 0.3, -0.1],
  bookshelf: [2.5, 0.5, 0],
  turntable: [2, 0.6, 0],
  pokewalker: [1.8, 0.6, 0],
}

/** Rotación fija de la pantalla del laptop (no hay anchor dedicado). */
export const LAPTOP_SCREEN_TILT: [number, number, number] = [-0.35, 0, 0]
