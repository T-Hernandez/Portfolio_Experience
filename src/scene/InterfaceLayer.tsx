import { useMemo, type ComponentType } from 'react'
import { Html } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import { useExperienceStore, type InteractiveObjectId } from '../state/useExperienceStore'
import { useSceneAnchors } from './SceneAnchorsProvider'
import { OBJECT_NODE_NAMES, UI_OFFSET, LAPTOP_SCREEN_TILT } from './framing'
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
  const { getAnchor, version } = useSceneAnchors()

  const node = activeObject ? getAnchor(OBJECT_NODE_NAMES[activeObject]) : undefined

  const position = useMemo(() => {
    if (!node || !activeObject) return null
    const center = new Box3().setFromObject(node).getCenter(new Vector3())
    return center.add(new Vector3(...UI_OFFSET[activeObject]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, activeObject, version])

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
