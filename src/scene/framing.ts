import type { InteractiveObjectId } from '../state/useExperienceStore'

/**
 * El .glb trae cámaras reales de Blender (nodos glTF tipo `camera`, una por
 * shot) — el encuadre no se calcula ni se ajusta a mano en ningún lado, se
 * lee directo la posición/rotación de la cámara resuelta por nombre. Blender
 * es la única fuente de verdad para el ángulo, igual que ya lo es para la
 * posición de los objetos.
 */

export const OBJECT_NODE_NAMES: Record<InteractiveObjectId, string> = {
  laptop: 'laptop',
  bookshelf: 'bookshelf',
  turntable: 'turntable',
  pokewalker: 'pokewalk',
}

/**
 * Nombre del nodo-cámara real en el glb para cada shot. three.js reemplaza
 * los espacios por guiones bajos al parsear el glTF (el nombre en Blender
 * es "laptop camera", pero `scene.getObjectByName` necesita "laptop_camera")
 * — confirmado inspeccionando `scene.traverse(...)` en el navegador, no es
 * un dato que figure así en el JSON del glb.
 */
export const CAMERA_NODE_NAMES: Record<InteractiveObjectId, string> = {
  laptop: 'laptop_camera',
  bookshelf: 'bookshelf_camera',
  turntable: 'turntable_camera',
  pokewalker: 'pokewalk_camera',
}

/** Cámara de la vista general/reposo. */
export const DEFAULT_CAMERA_NODE_NAME = 'general_camera'

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
