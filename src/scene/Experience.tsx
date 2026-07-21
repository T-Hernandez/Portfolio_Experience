import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Room from './Room'
import CameraRig from './CameraRig'
import InterfaceLayer from './InterfaceLayer'
import BackButton from '../ui/BackButton'

export default function Experience() {
  return (
    <>
      {/* Posición inicial aproximada solo para el primer frame; CameraRig
          la corrige inmediatamente contra DEFAULT_CAMERA (framing.ts). */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [1.5, 2, 4], fov: 45 }}>
        <color attach="background" args={['#0d0b0a']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} castShadow />
        <directionalLight position={[-2, 2, 1]} intensity={0.3} />

        {/* CameraRig e InterfaceLayer también leen la escena vía useRoomScene
            (useGLTF cacheado), así que también dependen del Suspense. */}
        <Suspense fallback={null}>
          <Room />
          <CameraRig />
          <InterfaceLayer />
        </Suspense>
      </Canvas>

      <BackButton />
    </>
  )
}
