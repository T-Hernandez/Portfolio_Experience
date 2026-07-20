import { useEffect } from 'react'
import InteractiveObject from './interactiveObject'
import Laptop from './objects/Laptop'
import Bookshelf from './objects/Bookshelf'
import Turntable from './objects/Turntable'
import Plant from './objects/Plant'
import PlaceholderCameraAnchors from './placeholder/PlaceholderCameraAnchors'
import { useSceneAnchors } from './SceneAnchorsProvider'

/**
 * Geometría placeholder mientras no existe public/models/room.glb.
 * Nombres y jerarquía pensados para mapear 1:1 con el modelo real del
 * SPECIFICATION.md (Wall, Floor, Desk, Chair, Laptop, Bookshelf, Turntable,
 * Plant), incluyendo los anchors (Camera_X, XAnchor) que consumen CameraRig
 * e InterfaceLayer. Estas posiciones son locales a este archivo: cuando
 * llegue el .glb, este componente completo se reemplaza y nadie más se
 * entera.
 */
export default function Room() {
  const { notifyReady } = useSceneAnchors()

  useEffect(() => {
    notifyReady()
  }, [notifyReady])

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

      <PlaceholderCameraAnchors />

      <InteractiveObject id="bookshelf" position={[-2.6, 0, -2.7]}>
        <Bookshelf />
      </InteractiveObject>

      <InteractiveObject id="laptop" position={[-0.6, 0.92, -2.28]}>
        <Laptop />
      </InteractiveObject>

      <InteractiveObject id="turntable" position={[0.6, 0.92, -2.28]}>
        <Turntable />
      </InteractiveObject>

      <InteractiveObject id="plant" position={[2.6, 0, -2.3]}>
        <Plant />
      </InteractiveObject>
    </group>
  )
}
