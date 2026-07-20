import { create } from 'zustand'

export type InteractiveObjectId = 'laptop' | 'bookshelf' | 'turntable' | 'plant'

interface ExperienceState {
  activeObject: InteractiveObjectId | null
  isTransitioning: boolean
  hoveredObject: InteractiveObjectId | null
  setActiveObject: (id: InteractiveObjectId | null) => void
  setTransitioning: (value: boolean) => void
  setHoveredObject: (id: InteractiveObjectId | null) => void
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeObject: null,
  isTransitioning: false,
  hoveredObject: null,
  setActiveObject: (id) => set({ activeObject: id }),
  setTransitioning: (value) => set({ isTransitioning: value }),
  setHoveredObject: (id) => set({ hoveredObject: id }),
}))
