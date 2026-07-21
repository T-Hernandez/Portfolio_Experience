import { useMemo, type ComponentType } from 'react'
import { Html } from '@react-three/drei'
import { Vector3 } from 'three'
import { useExperienceStore, type InteractiveObjectId } from '../state/useExperienceStore'
import { useRoomScene, getObjectBounds } from './useRoomScene'
import { OBJECT_NODE_NAMES, UI_OFFSET_FRACTION, LAPTOP_SCREEN_TILT } from './framing'
import LaptopScreen from '../ui/LaptopScreen'
import BookshelfCard from '../ui/BookshelfCard'
import TurntablePlayer from '../ui/TurntablePlayer'
import PokewalkerCard from '../ui/PokewalkerCard'

interface ObjectUIConfig {
  component: ComponentType
  /** true = clavado en la superficie del objeto (ej. pantalla del laptop) */
  transform?: boolean
  distanceFactor?: number
}

const OBJECT_UI_CONFIG: Record<InteractiveObjectId, ObjectUIConfig> = {
  laptop: { component: LaptopScreen, transform: true, distanceFactor: 0.55 },
  bookshelf: { component: BookshelfCard },
  turntable: { component: TurntablePlayer },
  pokewalker: { component: PokewalkerCard },
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

  const config = OBJECT_UI_CONFIG[activeObject]
  const Component = config.component

  return (
    <Html
      position={position}
      rotation={config.transform ? LAPTOP_SCREEN_TILT : undefined}
      transform={config.transform}
      distanceFactor={config.distanceFactor}
      center={!config.transform}
    >
      <Component />
    </Html>
  )
}
