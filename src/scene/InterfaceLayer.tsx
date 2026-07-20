import { Html } from '@react-three/drei'
import { useExperienceStore } from '../state/useExperienceStore'
import { OBJECT_POSITIONS } from './sceneConfig'
import LaptopScreen from '../ui/LaptopScreen'
import BookshelfCard from '../ui/BookshelfCard'
import TurntablePlayer from '../ui/TurntablePlayer'
import PlantCard from '../ui/PlantCard'

export default function InterfaceLayer() {
  const activeObject = useExperienceStore((s) => s.activeObject)

  if (activeObject === 'laptop') {
    const [x, y, z] = OBJECT_POSITIONS.laptop
    return (
      <Html position={[x, y + 0.15, z - 0.13]} rotation={[-0.25, 0, 0]} transform distanceFactor={0.55}>
        <LaptopScreen />
      </Html>
    )
  }

  if (activeObject === 'bookshelf') {
    const [x, y, z] = OBJECT_POSITIONS.bookshelf
    return (
      <Html position={[x + 0.55, y + 0.95, z + 0.2]} center>
        <BookshelfCard />
      </Html>
    )
  }

  if (activeObject === 'turntable') {
    const [x, y, z] = OBJECT_POSITIONS.turntable
    return (
      <Html position={[x + 0.55, y + 0.3, z]} center>
        <TurntablePlayer />
      </Html>
    )
  }

  if (activeObject === 'plant') {
    const [x, y, z] = OBJECT_POSITIONS.plant
    return (
      <Html position={[x + 0.45, y + 0.5, z]} center>
        <PlantCard />
      </Html>
    )
  }

  return null
}
