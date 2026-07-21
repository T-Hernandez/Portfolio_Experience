import { useGLTF } from '@react-three/drei'
import { Box3, Vector3, type Object3D } from 'three'
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
 * useGLTF cachea por URL, así que llamarlo desde Room/CameraRig/InterfaceLayer
 * no dispara tres cargas — todos comparten la misma escena ya parseada. No
 * hace falta un provider/contexto solo para compartir esta referencia.
 */
export function useRoomScene() {
  return useGLTF(ROOM_PATH).scene
}

/** Bounds cacheados de un nodo interactivo por su nombre real en el glb. */
export function getObjectBounds(scene: Object3D, nodeName: string): ObjectBounds | undefined {
  return computeBounds(scene).get(nodeName)
}

useGLTF.preload(ROOM_PATH)
