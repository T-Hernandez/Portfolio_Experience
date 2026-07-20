export default function Bookshelf() {
  return (
    <group name="Bookshelf">
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.8, 0.35]} />
        <meshStandardMaterial color="#4a3220" roughness={0.85} />
      </mesh>
      {[0.4, 0.9, 1.4].map((y) => (
        <mesh key={y} position={[0, y, 0.05]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.32]} />
          <meshStandardMaterial color="#2b1c10" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
