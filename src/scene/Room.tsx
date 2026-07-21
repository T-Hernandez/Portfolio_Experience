import InteractiveObject from './interactiveObject'
import CinematicTitle from './CinematicTitle'
import { useRoomScene } from './useRoomScene'
import { OBJECT_NODE_NAMES } from './framing'
import type { InteractiveObjectId } from '../state/useExperienceStore'

const INTERACTIVE_IDS = Object.keys(OBJECT_NODE_NAMES) as InteractiveObjectId[]

/**
 * Modelo real exportado desde Blender. El árbol completo se monta tal cual
 * (<primitive object={scene}/>) y cada objeto interactivo se resuelve por
 * nombre dentro de InteractiveObject — no depende de la profundidad de
 * anidado del glb, así que un cambio de jerarquía en Blender no rompe nada
 * acá.
 *
 * Los InteractiveObject se declaran como HIJOS JSX de <primitive
 * object={scene}> (no como hermanos) a propósito: cuando reparentan su nodo
 * con attach(), el grupo contenedor sigue colgando de `scene`, así que
 * `scene.getObjectByName(...)` (usado por CameraRig/InterfaceLayer) sigue
 * encontrando el objeto después del reparenting. Si estuvieran fuera de
 * <primitive>, quedarían huérfanos de `scene` y esa búsqueda fallaría.
 */
export default function Room() {
  const scene = useRoomScene()

  return (
    <group name="Room">
      <primitive object={scene}>
        {INTERACTIVE_IDS.map((id) => (
          <InteractiveObject key={id} id={id} objectName={OBJECT_NODE_NAMES[id]} scene={scene} />
        ))}
      </primitive>
      <CinematicTitle />
    </group>
  )
}
