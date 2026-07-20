import type { InteractiveObjectId } from '../state/useExperienceStore'

/**
 * Nombres de objetos que el modelo (placeholder hoy, room.glb real después)
 * debe exponer. Cámara e interfaces resuelven estos nombres en runtime vía
 * scene.getObjectByName — ningún archivo de configuración debe volver a
 * guardar coordenadas fijas para esto.
 */

export const CAMERA_ANCHOR_NAMES: Record<'default' | InteractiveObjectId, string> = {
  default: 'Camera_Default',
  laptop: 'Camera_Laptop',
  bookshelf: 'Camera_Bookshelf',
  turntable: 'Camera_Turntable',
  plant: 'Camera_Plant',
}

export const UI_ANCHOR_NAMES: Record<InteractiveObjectId, string> = {
  laptop: 'LaptopScreenAnchor',
  bookshelf: 'BookshelfAnchor',
  turntable: 'TurntableAnchor',
  plant: 'PlantAnchor',
}
