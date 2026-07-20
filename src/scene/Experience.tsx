import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Room from './Room'
import CameraRig from './CameraRig'
import InterfaceLayer from './InterfaceLayer'
import { SceneAnchorsProvider } from './SceneAnchorsProvider'
import BackButton from '../ui/BackButton'

export default function Experience() {
  return (
    <>
      {/* Posición inicial aproximada solo para el primer frame; CameraRig
          la corrige inmediatamente contra el anchor Camera_Default. */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0.4, 1.55, 2.6], fov: 45 }}>
        <color attach="background" args={['#0d0b0a']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} castShadow />
        <directionalLight position={[-2, 2, 1]} intensity={0.3} />

        <SceneAnchorsProvider>
          <Suspense fallback={null}>
            <Room />
          </Suspense>
          <CameraRig />
          <InterfaceLayer />
        </SceneAnchorsProvider>
      </Canvas>

      <BackButton />
    </>
  )
}
