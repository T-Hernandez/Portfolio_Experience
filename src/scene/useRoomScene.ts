import { useGLTF } from '@react-three/drei'
import { Box3, Vector3, type Light, type Object3D } from 'three'
import { OBJECT_NODE_NAMES } from './framing'

const ROOM_PATH = '/models/room.glb'

interface ObjectBounds {
  box: Box3
  center: Vector3
}

/**
 * Box3 de cada objeto interactivo, calculado UNA sola vez por escena (no en
 * cada transición de cámara/UI) y compartido por toda la app — así cámara,
 * UI y cualquier interacción futura parten exactamente del mismo centro, en
 * vez de recalcular (y potencialmente divergir) cada una por su lado. Se
 * cachea con un WeakMap por instancia de `scene`, no por nombre de nodo
 * global — si el glb se recarga (HMR, o un futuro modelo distinto) el
 * WeakMap simplemente no tiene entrada todavía y se recalcula solo.
 */
const boundsCache = new WeakMap<Object3D, Map<string, ObjectBounds>>()

/**
 * Este caché asume geometría estática: estos bounds representan el objeto
 * en el momento en que se calcularon, una sola vez. Si algún día un objeto
 * interactivo cambia de geometría o transform (tapa del laptop abriéndose,
 * tocadiscos girando, animaciones del pokewalker), este cache queda
 * desactualizado — hay que invalidar y recalcular sus bounds explícitamente
 * (ej. `boundsCache.delete(scene)` o una versión por-nodo) en vez de asumir
 * que siguen siendo válidos.
 */
function computeBounds(scene: Object3D): Map<string, ObjectBounds> {
  const cached = boundsCache.get(scene)
  if (cached) return cached

  const bounds = new Map<string, ObjectBounds>()
  for (const nodeName of Object.values(OBJECT_NODE_NAMES)) {
    const node = scene.getObjectByName(nodeName)
    if (!node) continue
    const box = new Box3().setFromObject(node)
    bounds.set(nodeName, { box, center: box.getCenter(new Vector3()) })
  }
  boundsCache.set(scene, bounds)
  return bounds
}

/**
 * Blender exporta la intensidad de sus luces (KHR_lights_punctual) en
 * candela reales — para "light 1"/"light 2" eso son números de cientos de
 * miles. Es el valor físicamente correcto, pero al aplicarlo tal cual en
 * three.js (que usa esas mismas unidades para point/spot lights) el cálculo
 * de sombreado desborda a corta distancia y la escena sale directamente
 * negra, incluso con tone mapping ACES. Se escalan una sola vez por escena
 * a un rango que el renderer en tiempo real puede manejar — no es un ajuste
 * "para que se vea lindo", es necesario para que no rompa el shading.
 */
const LIGHT_INTENSITY_SCALE = 1 / 450

/**
 * NOTA: bajar el `decay` de estas point lights (de 2, físicamente correcto,
 * a algo menor) se probó para suavizar el "hot spot" cerca de la fuente y
 * terminó rompiendo todo de nuevo (pantalla negra) — un decay más chico
 * hace que la luz alcance MUCHO más lejos con la misma intensidad, y con
 * candelas de este tamaño eso vuelve a desbordar el shading en otras zonas
 * de la escena. No tocar el decay sin volver a probar con una intensidad
 * mucho más baja en simultáneo.
 */
const normalizedLightScenes = new WeakSet<Object3D>()

function normalizeLightIntensities(scene: Object3D) {
  if (normalizedLightScenes.has(scene)) return
  scene.traverse((obj) => {
    if ((obj as Light).isLight) {
      ;(obj as Light).intensity *= LIGHT_INTENSITY_SCALE
    }
  })
  normalizedLightScenes.add(scene)
}

/**
 * useGLTF cachea por URL, así que llamarlo desde Room/CameraRig/InterfaceLayer
 * no dispara tres cargas — todos comparten la misma escena ya parseada. No
 * hace falta un provider/contexto solo para compartir esta referencia.
 */
export function useRoomScene() {
  const scene = useGLTF(ROOM_PATH).scene
  normalizeLightIntensities(scene)
  return scene
}

/** Bounds cacheados de un nodo interactivo por su nombre real en el glb. */
export function getObjectBounds(scene: Object3D, nodeName: string): ObjectBounds | undefined {
  return computeBounds(scene).get(nodeName)
}

useGLTF.preload(ROOM_PATH)
