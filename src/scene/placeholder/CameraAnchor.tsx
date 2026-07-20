import { useLayoutEffect, useRef } from 'react'
import type { Group } from 'three'

interface CameraAnchorProps {
  name: string
  position: [number, number, number]
  lookAt: [number, number, number]
}

/**
 * Imita lo que en Blender sería un Empty ya orientado (Camera_Laptop,
 * Camera_Bookshelf, ...). Cuando exista room.glb, este componente se borra
 * y esos nombres se resuelven directamente desde el modelo — CameraRig no
 * cambia porque solo conoce el nombre, no cómo se construyó el anchor.
 */
export default function CameraAnchor({ name, position, lookAt }: CameraAnchorProps) {
  const ref = useRef<Group>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    // Object3D.lookAt() en un objeto no-cámara orienta su +Z hacia el
    // target; una cámara real usa -Z como "adelante". Compensamos con un
    // giro de 180° para que copiar este quaternion a camera.quaternion
    // produzca el encuadre correcto.
    ref.current.lookAt(...lookAt)
    ref.current.rotateY(Math.PI)
  }, [lookAt])

  return <group ref={ref} name={name} position={position} />
}
