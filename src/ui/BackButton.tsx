import { useExperienceStore } from '../state/useExperienceStore'

export default function BackButton() {
  const activeObject = useExperienceStore((s) => s.activeObject)
  const mode = useExperienceStore((s) => s.mode)
  const unfocus = useExperienceStore((s) => s.unfocus)

  if (!activeObject) return null

  return (
    <button
      onClick={unfocus}
      disabled={mode !== 'focused'}
      className="fixed top-6 left-6 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
    >
      ← Volver
    </button>
  )
}
