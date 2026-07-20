import InteractiveObject from './interactiveObject'
import Laptop from './objects/Laptop'
import Bookshelf from './objects/Bookshelf'
import Turntable from './objects/Turntable'
import Plant from './objects/Plant'
import { OBJECT_POSITIONS } from './sceneConfig'

/**
 * Geometría placeholder mientras no existe public/models/room.glb.
 * Nombres y jerarquía pensados para mapear 1:1 con el modelo real del
 * SPECIFICATION.md (Wall, Floor, Desk, Chair, Laptop, Bookshelf, Turntable, Plant).
 */
export default function Room() {
  return (
    <group name="Room">
      <mesh
        name="Floor"
        position={[0, 0, -1]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#4a3f35" roughness={1} />
      </mesh>

      <mesh name="Wall" position={[0, 2.5, -3]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#8a7360" roughness={1} />
      </mesh>

      <mesh name="Desk" position={[0.1, 0.42, -2.3]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.84, 0.7]} />
        <meshStandardMaterial color="#5c4531" roughness={0.7} />
      </mesh>

      <mesh name="Chair" position={[1.9, 0.45, -1.9]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.9, 0.5]} />
        <meshStandardMaterial color="#3d2f22" roughness={0.8} />
      </mesh>

      <InteractiveObject id="bookshelf" position={OBJECT_POSITIONS.bookshelf}>
        <Bookshelf />
      </InteractiveObject>

      <InteractiveObject id="laptop" position={OBJECT_POSITIONS.laptop}>
        <Laptop />
      </InteractiveObject>

      <InteractiveObject id="turntable" position={OBJECT_POSITIONS.turntable}>
        <Turntable />
      </InteractiveObject>

      <InteractiveObject id="plant" position={OBJECT_POSITIONS.plant}>
        <Plant />
      </InteractiveObject>
    </group>
  )
}
