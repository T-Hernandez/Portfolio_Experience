import { useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { PerspectiveCamera, Quaternion, Vector3 } from 'three'
import { useExperienceStore } from '../state/useExperienceStore'
import { useRoomScene, getObjectBounds } from './useRoomScene'
import { OBJECT_NODE_NAMES, CAMERA_FRAMING, DEFAULT_CAMERA } from './framing'

/**
 * No hay Empties Camera_* en el modelo real (el usuario prefirió capturas
 * de referencia). La cámara se calcula en runtime: se resuelve el centro
 * cacheado del objeto (getObjectBounds — calculado una sola vez por escena,
 * no en cada transición) y se le aplica un offset/lookAt ajustado a mano
 * contra design/reference/*.png. La orientación se deriva con una
 * PerspectiveCamera de scratch (así se usa la convención -Z correcta, sin
 * el bug de +Z/-Z que da Object3D.lookAt en un objeto no-cámara).
 */
export default function CameraRig() {
  const { camera } = useThree()
  const activeObject = useExperienceStore((s) => s.activeObject)
  const setMode = useExperienceStore((s) => s.setMode)
  const scene = useRoomScene()
  const didInit = useRef(false)
  const tween = useRef({ t: 0 })
  const scratchCam = useRef(new PerspectiveCamera())

  useLayoutEffect(() => {
    let targetPos: Vector3
    let targetQuat: Quaternion

    if (activeObject) {
      const nodeName = OBJECT_NODE_NAMES[activeObject]
      const bounds = getObjectBounds(scene, nodeName)
      if (!bounds) return

      const center = bounds.center
      const shot = CAMERA_FRAMING[activeObject]

      const pos = center.clone().add(new Vector3(...shot.offset))
      const lookAt = center.clone().add(new Vector3(...shot.lookAtOffset))

      scratchCam.current.position.copy(pos)
      scratchCam.current.lookAt(lookAt)
      targetPos = pos
      targetQuat = scratchCam.current.quaternion.clone()
    } else {
      const origin = new Vector3(...DEFAULT_CAMERA.origin)
      const pos = origin.clone().add(new Vector3(...DEFAULT_CAMERA.offset))
      const lookAt = origin.clone().add(new Vector3(...DEFAULT_CAMERA.lookAtOffset))

      scratchCam.current.position.copy(pos)
      scratchCam.current.lookAt(lookAt)
      targetPos = pos
      targetQuat = scratchCam.current.quaternion.clone()
    }

    if (!didInit.current) {
      didInit.current = true
      camera.position.copy(targetPos)
      camera.quaternion.copy(targetQuat)
      setMode(activeObject ? 'focused' : 'idle')
      return
    }

    const startPos = camera.position.clone()
    const startQuat = camera.quaternion.clone()
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
      },
      onComplete: () => setMode(activeObject ? 'focused' : 'idle'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeObject, scene])

  return null
}
