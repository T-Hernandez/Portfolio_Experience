import { useState, type ReactNode } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useExperienceStore, type InteractiveObjectId } from '../state/useExperienceStore'

interface InteractiveObjectProps {
  id: InteractiveObjectId
  position: [number, number, number]
  children: ReactNode
}

export default function InteractiveObject({ id, position, children }: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false)
  const mode = useExperienceStore((s) => s.mode)
  const focusObject = useExperienceStore((s) => s.focusObject)
  const setHoveredObject = useExperienceStore((s) => s.setHoveredObject)

  const locked = mode !== 'idle'

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (locked) return
    setHovered(true)
    setHoveredObject(id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(false)
    setHoveredObject(null)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (locked) return
    focusObject(id)
  }

  return (
    <group
      position={position}
      scale={hovered && !locked ? 1.04 : 1}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {children}
    </group>
  )
}
