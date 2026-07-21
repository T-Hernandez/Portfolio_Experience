import { useLayoutEffect, useRef } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { Color, Group, Material, Mesh, Object3D } from 'three'
import { useExperienceStore, type InteractiveObjectId } from '../state/useExperienceStore'

interface InteractiveObjectProps {
  id: InteractiveObjectId
  objectName: string
  scene: Object3D
}

type EmissiveMaterial = Material & { emissive: Color; emissiveIntensity: number }

function hasEmissive(mat: Material): mat is EmissiveMaterial {
  return 'emissive' in mat
}

const HOVER_EMISSIVE = 0xfff2d0
const HOVER_INTENSITY = 0.35

/**
 * Resuelve el nodo por nombre (scene.getObjectByName) en vez de asumir una
 * jerarquía plana — si mañana el glb anida los objetos bajo un grupo
 * "Furniture", esto sigue andando sin tocar Room.tsx. Se usa `attach()` en
 * vez de `add()` para reparentarlo: preserva el transform mundial real del
 * nodo sin importar cuán anidado estaba.
 *
 * El hover no escala el objeto — escalar un laptop o un tocadiscos rompe
 * la ilusión de que son objetos reales. En su lugar hace un glow emissive
 * sobre materiales CLONADOS (así no afecta a otros objetos que compartan
 * el material original) + cambio de cursor.
 */
export default function InteractiveObject({ id, objectName, scene }: InteractiveObjectProps) {
  const groupRef = useRef<Group>(null)
  const originalEmissive = useRef(new Map<EmissiveMaterial, { emissive: number; intensity: number }>())
  const mode = useExperienceStore((s) => s.mode)
  const focusObject = useExperienceStore((s) => s.focusObject)
  const setHoveredObject = useExperienceStore((s) => s.setHoveredObject)

  useLayoutEffect(() => {
    const node = scene.getObjectByName(objectName)
    if (!node || !groupRef.current) return
    groupRef.current.attach(node)

    node.traverse((child) => {
      const mesh = child as Mesh
      if (!mesh.isMesh) return
      const materials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((m) => m.clone())
      mesh.material = materials.length > 1 ? materials : materials[0]
      materials.forEach((mat) => {
        if (hasEmissive(mat)) {
          originalEmissive.current.set(mat, {
            emissive: mat.emissive.getHex(),
            intensity: mat.emissiveIntensity,
          })
        }
      })
    })
  }, [scene, objectName])

  const locked = mode !== 'idle'

  const setHoverGlow = (hovered: boolean) => {
    groupRef.current?.traverse((child) => {
      const mesh = child as Mesh
      if (!mesh.isMesh) return
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach((mat) => {
        if (!hasEmissive(mat)) return
        if (hovered) {
          mat.emissive.setHex(HOVER_EMISSIVE)
          mat.emissiveIntensity = HOVER_INTENSITY
        } else {
          const original = originalEmissive.current.get(mat)
          if (original) {
            mat.emissive.setHex(original.emissive)
            mat.emissiveIntensity = original.intensity
          }
        }
      })
    })
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (locked) return
    setHoverGlow(true)
    setHoveredObject(id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHoverGlow(false)
    setHoveredObject(null)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (locked) return
    focusObject(id)
  }

  return (
    <group ref={groupRef} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onClick={handleClick} />
  )
}
