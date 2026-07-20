import { useExperienceStore } from '../state/useExperienceStore'

export default function BackButton() {
  const activeObject = useExperienceStore((s) => s.activeObject)
  const setActiveObject = useExperienceStore((s) => s.setActiveObject)

  if (!activeObject) return null

  return (
    <button
      onClick={() => setActiveObject(null)}
      className="fixed top-6 left-6 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
    >
      ← Volver
    </button>
  )
}
