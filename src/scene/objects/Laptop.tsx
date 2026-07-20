export default function Laptop() {
  return (
    <group name="Laptop">
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.02, 0.3]} />
        <meshStandardMaterial color="#c7c7c7" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh name="LaptopScreen" position={[0, 0.15, -0.14]} rotation={[-0.25, 0, 0]} castShadow>
        <boxGeometry args={[0.42, 0.28, 0.015]} />
        <meshStandardMaterial
          color="#111114"
          emissive="#1a2b3d"
          emissiveIntensity={0.5}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}
