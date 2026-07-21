import { create } from 'zustand'

export type InteractiveObjectId = 'laptop' | 'bookshelf' | 'turntable' | 'pokewalker'
export type ExperienceMode = 'idle' | 'transitioning' | 'focused'

interface ExperienceState {
  mode: ExperienceMode
  activeObject: InteractiveObjectId | null
  hoveredObject: InteractiveObjectId | null
  focusObject: (id: InteractiveObjectId) => void
  unfocus: () => void
  setMode: (mode: ExperienceMode) => void
  setHoveredObject: (id: InteractiveObjectId | null) => void
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  mode: 'idle',
  activeObject: null,
  hoveredObject: null,

  focusObject: (id) => {
    if (get().mode !== 'idle') return
    set({ activeObject: id, mode: 'transitioning' })
  },

  unfocus: () => {
    if (get().mode === 'idle') return
    set({ activeObject: null, mode: 'transitioning' })
  },

  setMode: (mode) => set({ mode }),
  setHoveredObject: (id) => set({ hoveredObject: id }),
}))
