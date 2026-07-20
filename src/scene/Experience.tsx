import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Room from './Room'
import CameraRig from './CameraRig'
import InterfaceLayer from './InterfaceLayer'
import { CAMERA_DEFAULT } from './sceneConfig'
import BackButton from '../ui/BackButton'

export default function Experience() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: CAMERA_DEFAULT.position, fov: CAMERA_DEFAULT.fov }}
      >
        <color attach="background" args={['#0d0b0a']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} castShadow />
        <directionalLight position={[-2, 2, 1]} intensity={0.3} />

        <Suspense fallback={null}>
          <Room />
        </Suspense>

        <CameraRig />
        <InterfaceLayer />
      </Canvas>

      <BackButton />
    </>
  )
}
