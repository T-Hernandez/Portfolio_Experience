import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import Room from './Room'
import CameraRig from './CameraRig'
import InterfaceLayer from './InterfaceLayer'
import BackButton from '../ui/BackButton'

export default function Experience() {
  return (
    <>
      {/* Posición/fov inicial aproximada solo para el primer frame; CameraRig
          la corrige inmediatamente contra la cámara real "general camera"
          del glb (framing.ts / CameraRig.tsx). */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [1.5, 2, 4], fov: 23 }}
        gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1 }}
      >
        <color attach="background" args={['#0d0b0a']} />

        {/* Sin luces hardcodeadas acá — "light 1"/"light 2" vienen del propio
            .glb (KHR_lights_punctual) y se montan solas al cargar la escena
            en Room.tsx. Sus intensidades son candela reales exportadas desde
            Blender (números grandes), por eso el tone mapping ACES arriba:
            sin comprimir el rango dinámico, la escena sale sobreexpuesta. */}
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
