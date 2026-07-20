import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import type { Group, Object3D } from 'three'

interface SceneAnchorsContextValue {
  getAnchor: (name: string) => Object3D | undefined
  /** Los consumidores dependientes de anchors deben incluir esto en sus deps
   * para re-intentar la resolución cuando el modelo (placeholder o glTF async)
   * termine de montar. */
  version: number
  notifyReady: () => void
}

const SceneAnchorsContext = createContext<SceneAnchorsContextValue | null>(null)

/**
 * Resuelve objetos por nombre dentro del árbol de la escena. Es la única
 * vía por la que CameraRig e InterfaceLayer deben conocer "dónde está X" —
 * nunca deben recibir coordenadas propias.
 */
export function SceneAnchorsProvider({ children }: { children: ReactNode }) {
  const rootRef = useRef<Group>(null)
  const [version, setVersion] = useState(0)

  const getAnchor = useCallback((name: string) => rootRef.current?.getObjectByName(name), [])
  const notifyReady = useCallback(() => setVersion((v) => v + 1), [])

  return (
    <SceneAnchorsContext.Provider value={{ getAnchor, notifyReady, version }}>
      <group ref={rootRef} name="SceneRoot">
        {children}
      </group>
    </SceneAnchorsContext.Provider>
  )
}

export function useSceneAnchors() {
  const ctx = useContext(SceneAnchorsContext)
  if (!ctx) throw new Error('useSceneAnchors debe usarse dentro de SceneAnchorsProvider')
  return ctx
}
