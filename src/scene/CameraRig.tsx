import { useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { MathUtils, Quaternion, Vector3, type PerspectiveCamera } from 'three'
import { useExperienceStore } from '../state/useExperienceStore'
import { useRoomScene } from './useRoomScene'
import { CAMERA_NODE_NAMES, DEFAULT_CAMERA_NODE_NAME } from './framing'

/**
 * El .glb trae cámaras reales de Blender (nodos glTF tipo `camera`) — no
 * hay ningún cálculo ni offset acá. Se resuelve el nodo-cámara por nombre
 * y se copia su posición/rotación/fov mundiales tal cual; GLTFLoader ya
 * instancia esos nodos como THREE.PerspectiveCamera reales, así que no
 * hace falta reconstruir la orientación con lookAt.
 */
export default function CameraRig() {
  const { camera } = useThree()
  const activeObject = useExperienceStore((s) => s.activeObject)
  const setMode = useExperienceStore((s) => s.setMode)
  const scene = useRoomScene()
  const didInit = useRef(false)
  const tween = useRef({ t: 0 })

  useLayoutEffect(() => {
    const nodeName = activeObject ? CAMERA_NODE_NAMES[activeObject] : DEFAULT_CAMERA_NODE_NAME
    const camNode = scene.getObjectByName(nodeName) as PerspectiveCamera | undefined
    if (!camNode) return

    scene.updateMatrixWorld(true)
    const targetPos = camNode.getWorldPosition(new Vector3())
    const targetQuat = camNode.getWorldQuaternion(new Quaternion())
    const targetFov = camNode.fov

    const perspCamera = camera as PerspectiveCamera

    if (!didInit.current) {
      didInit.current = true
      camera.position.copy(targetPos)
      camera.quaternion.copy(targetQuat)
      perspCamera.fov = targetFov
      perspCamera.updateProjectionMatrix()
      setMode(activeObject ? 'focused' : 'idle')
      return
    }

    const startPos = camera.position.clone()
    const startQuat = camera.quaternion.clone()
    const startFov = perspCamera.fov
    const state = tween.current
    state.t = 0
    setMode('transitioning')

    gsap.killTweensOf(state)
    gsap.to(state, {
      t: 1,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.position.lerpVectors(startPos, targetPos, state.t)
        camera.quaternion.slerpQuaternions(startQuat, targetQuat, state.t)
        perspCamera.fov = MathUtils.lerp(startFov, targetFov, state.t)
        perspCamera.updateProjectionMatrix()
      },
      onComplete: () => setMode(activeObject ? 'focused' : 'idle'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeObject, scene])

  return null
}
