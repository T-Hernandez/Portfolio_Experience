import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

export default function Turntable() {
  const vinylRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (vinylRef.current) {
      vinylRef.current.rotation.y += delta * 1.1
    }
  })

  return (
    <group name="Turntable">
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.08, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      <mesh
        ref={vinylRef}
        name="Vinyl"
        position={[0, 0.09, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.16, 0.16, 0.01, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.1} />
      </mesh>
      <group name="TurntableAnchor" position={[0.55, 0.3, 0]} />
    </group>
  )
}
