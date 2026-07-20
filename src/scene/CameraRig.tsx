import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { Vector3 } from 'three'
import { useExperienceStore } from '../state/useExperienceStore'
import { CAMERA_DEFAULT, CAMERA_FOCUS } from './sceneConfig'

export default function CameraRig() {
  const { camera } = useThree()
  const activeObject = useExperienceStore((s) => s.activeObject)
  const setTransitioning = useExperienceStore((s) => s.setTransitioning)
  const lookAtTarget = useRef(new Vector3(...CAMERA_DEFAULT.lookAt))
  const didInit = useRef(false)

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    camera.position.set(...CAMERA_DEFAULT.position)
    lookAtTarget.current.set(...CAMERA_DEFAULT.lookAt)
    camera.lookAt(lookAtTarget.current)
  }, [camera])

  useEffect(() => {
    if (!didInit.current) return

    const target = activeObject ? CAMERA_FOCUS[activeObject] : CAMERA_DEFAULT
    setTransitioning(true)

    const tl = gsap.timeline({ onComplete: () => setTransitioning(false) })

    tl.to(
      camera.position,
      {
        x: target.position[0],
        y: target.position[1],
        z: target.position[2],
        duration: 1.4,
        ease: 'power2.inOut',
      },
      0,
    )

    tl.to(
      lookAtTarget.current,
      {
        x: target.lookAt[0],
        y: target.lookAt[1],
        z: target.lookAt[2],
        duration: 1.4,
        ease: 'power2.inOut',
      },
      0,
    )

    return () => {
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeObject])

  useFrame(() => {
    camera.lookAt(lookAtTarget.current)
  })

  return null
}
