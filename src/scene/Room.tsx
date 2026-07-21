import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import InteractiveObject from './interactiveObject'
import CinematicTitle from './CinematicTitle'
import { useSceneAnchors } from './SceneAnchorsProvider'
import { OBJECT_NODE_NAMES } from './framing'
import type { InteractiveObjectId } from '../state/useExperienceStore'

const INTERACTIVE_IDS = Object.keys(OBJECT_NODE_NAMES) as InteractiveObjectId[]

/**
 * Modelo real exportado desde Blender. El árbol completo se monta tal cual
 * (<primitive object={scene}/>) y cada objeto interactivo se resuelve por
 * nombre dentro de InteractiveObject — no depende de la profundidad de
 * anidado del glb, así que un cambio de jerarquía en Blender no rompe nada
 * acá.
 */
export default function Room() {
  const { scene } = useGLTF('/models/room.glb')
  const { notifyReady } = useSceneAnchors()

  useEffect(() => {
    notifyReady()
  }, [notifyReady, scene])

  return (
    <group name="Room">
      <primitive object={scene} />
      {INTERACTIVE_IDS.map((id) => (
        <InteractiveObject key={id} id={id} objectName={OBJECT_NODE_NAMES[id]} scene={scene} />
      ))}
      <CinematicTitle />
    </group>
  )
}

useGLTF.preload('/models/room.glb')
