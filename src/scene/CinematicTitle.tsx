import { Text } from '@react-three/drei'
import { useExperienceStore } from '../state/useExperienceStore'

/**
 * Texto 3D montado sobre el hueco de pared que el usuario dejó libre en el
 * modelo (ver "Reference general view.png"). Es parte del mundo, no un
 * overlay DOM — cumple el "Principio de inmersión" del spec. Posición
 * estimada visualmente, a recalibrar si cambia la composición del muro.
 */
export default function CinematicTitle() {
  const mode = useExperienceStore((s) => s.mode)

  if (mode === 'focused') return null

  return (
    <group position={[-3.2, 10, -1]} rotation={[0, Math.PI / 2, 0]}>
      <Text
        fontSize={1.3}
        color="#f4ecd8"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        maxWidth={14}
      >
        Portafolio
      </Text>
      <Text
        position={[0, -1.4, 0]}
        fontSize={0.55}
        color="#c9bfa8"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        Tomás Hernández
      </Text>
    </group>
  )
}
