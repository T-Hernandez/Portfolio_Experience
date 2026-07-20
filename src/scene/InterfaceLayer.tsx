import { useMemo, type ComponentType } from 'react'
import { Html } from '@react-three/drei'
import { Euler, Quaternion, Vector3 } from 'three'
import { useExperienceStore, type InteractiveObjectId } from '../state/useExperienceStore'
import { useSceneAnchors } from './SceneAnchorsProvider'
import { UI_ANCHOR_NAMES } from './anchors'
import LaptopScreen from '../ui/LaptopScreen'
import BookshelfCard from '../ui/BookshelfCard'
import TurntablePlayer from '../ui/TurntablePlayer'
import PlantCard from '../ui/PlantCard'

interface ObjectUIConfig {
  component: ComponentType
  /** true = clavado en la superficie del anchor (ej. pantalla del laptop) */
  transform?: boolean
  distanceFactor?: number
}

const OBJECT_UI_CONFIG: Record<InteractiveObjectId, ObjectUIConfig> = {
  laptop: { component: LaptopScreen, transform: true, distanceFactor: 0.55 },
  bookshelf: { component: BookshelfCard },
  turntable: { component: TurntablePlayer },
  plant: { component: PlantCard },
}

export default function InterfaceLayer() {
  const activeObject = useExperienceStore((s) => s.activeObject)
  const { getAnchor, version } = useSceneAnchors()

  const anchor = activeObject ? getAnchor(UI_ANCHOR_NAMES[activeObject]) : undefined

  const transform = useMemo(() => {
    if (!anchor) return null
    const position = anchor.getWorldPosition(new Vector3())
    const rotation = new Euler().setFromQuaternion(anchor.getWorldQuaternion(new Quaternion()))
    return { position, rotation }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor, version])

  if (!activeObject || !transform) return null

  const config = OBJECT_UI_CONFIG[activeObject]
  const Component = config.component

  return (
    <Html
      position={transform.position}
      rotation={[transform.rotation.x, transform.rotation.y, transform.rotation.z]}
      transform={config.transform}
      distanceFactor={config.distanceFactor}
      center={!config.transform}
    >
      <Component />
    </Html>
  )
}
