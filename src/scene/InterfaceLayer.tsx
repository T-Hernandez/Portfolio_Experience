import { useMemo, type ComponentType } from 'react'
import { Html } from '@react-three/drei'
import { Vector3 } from 'three'
import { useExperienceStore, type InteractiveObjectId } from '../state/useExperienceStore'
import { useRoomScene, getObjectBounds } from './useRoomScene'
import { OBJECT_NODE_NAMES, UI_OFFSET_FRACTION } from './framing'
import LaptopScreen from '../ui/LaptopScreen'
import BookshelfCard from '../ui/BookshelfCard'
import TurntablePlayer from '../ui/TurntablePlayer'
import PokewalkerCard from '../ui/PokewalkerCard'

const OBJECT_UI_CONFIG: Record<InteractiveObjectId, ComponentType> = {
  laptop: LaptopScreen,
  bookshelf: BookshelfCard,
  turntable: TurntablePlayer,
  pokewalker: PokewalkerCard,
}

export default function InterfaceLayer() {
  const activeObject = useExperienceStore((s) => s.activeObject)
  const scene = useRoomScene()

  const position = useMemo(() => {
    if (!activeObject) return null
    const bounds = getObjectBounds(scene, OBJECT_NODE_NAMES[activeObject])
    if (!bounds) return null
    const size = bounds.box.getSize(new Vector3())
    const [fx, fy, fz] = UI_OFFSET_FRACTION[activeObject]
    return bounds.center.clone().add(new Vector3(size.x * fx, size.y * fy, size.z * fz))
  }, [scene, activeObject])

  if (!activeObject || !position) return null

  const Component = OBJECT_UI_CONFIG[activeObject]

  return (
    <Html position={position} center>
      <Component />
    </Html>
  )
}
