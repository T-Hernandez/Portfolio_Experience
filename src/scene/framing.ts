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

/** Vista general — tuneada contra la captura del viewport de Blender (2026-07-22). */
export const DEFAULT_CAMERA: CameraShot & { origin: [number, number, number] } = {
  origin: [-1, 5.4, -1],
  offset: [22, 0.5, 0],
  lookAtOffset: [-2, -0.9, 0],
}

/**
 * Offset del panel de UI relativo al centro del Box3 del objeto, expresado
 * como fracción del tamaño (ancho/alto/profundo) del propio Box3 en vez de
 * un vector absoluto — así el panel no "flota" en el centro geométrico del
 * objeto (ej. el centro del laptop cae dentro del teclado, no en la
 * pantalla) y el desplazamiento se mantiene proporcional si el objeto
 * cambia de tamaño. Calculado como (offset absoluto anterior / tamaño real
 * del Box3 medido en runtime) para reproducir exactamente el encuadre ya
 * validado contra las capturas de referencia.
 */
export const UI_OFFSET_FRACTION: Record<InteractiveObjectId, [number, number, number]> = {
  laptop: [0, 0.0794, -0.0194],
  bookshelf: [0.4476, 0.038, 0],
  turntable: [0.505, 0.4399, 0],
  pokewalker: [1.3725, 2.3867, 0],
}

/** Rotación fija de la pantalla del laptop (no hay anchor dedicado). */
export const LAPTOP_SCREEN_TILT: [number, number, number] = [-0.35, 0, 0]
