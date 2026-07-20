import { useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { Quaternion, Vector3 } from 'three'
import { useExperienceStore } from '../state/useExperienceStore'
import { useSceneAnchors } from './SceneAnchorsProvider'
import { CAMERA_ANCHOR_NAMES } from './anchors'

/**
 * La cámara nunca guarda su propio destino: copia/interpola hacia la
 * transform (posición + orientación) completa del anchor Camera_* que
 * corresponda. Mover un mueble o reencuadrar un shot en Blender no debería
 * requerir tocar este archivo.
 */
export default function CameraRig() {
  const { camera } = useThree()
  const activeObject = useExperienceStore((s) => s.activeObject)
  const setMode = useExperienceStore((s) => s.setMode)
  const { getAnchor, version } = useSceneAnchors()
  const didInit = useRef(false)
  const tween = useRef({ t: 0 })

  useLayoutEffect(() => {
    const anchorName = activeObject ? CAMERA_ANCHOR_NAMES[activeObject] : CAMERA_ANCHOR_NAMES.default
    const anchor = getAnchor(anchorName)
    if (!anchor) return

    const targetPos = anchor.getWorldPosition(new Vector3())
    const targetQuat = anchor.getWorldQuaternion(new Quaternion())

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
  }, [activeObject, version])

  return null
}
