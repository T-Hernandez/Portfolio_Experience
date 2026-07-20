export default function Plant() {
  return (
    <group name="Plant">
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.24, 12]} />
        <meshStandardMaterial color="#8a5a3c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#2f5d34" roughness={0.8} />
      </mesh>
      <group name="PlantAnchor" position={[0.45, 0.5, 0]} />
    </group>
  )
}
