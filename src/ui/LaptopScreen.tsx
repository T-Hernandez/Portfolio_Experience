import { useState } from 'react'
import { projects } from '../content/projects'

export default function LaptopScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const active = projects.find((p) => p.id === selectedId)

  return (
    <div className="w-[300px] h-[190px] bg-[#0b0e14] text-[#d7e6ff] rounded-[2px] p-3 font-mono text-[10px] overflow-hidden shadow-[0_0_18px_rgba(80,140,255,0.25)] select-none">
      {!active ? (
        <>
          <p className="text-[#7fa8ff] mb-2 tracking-wide">~/proyectos</p>
          <ul className="space-y-1.5">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setSelectedId(p.id)}
                  className="text-left w-full hover:text-[#7fa8ff] transition-colors cursor-pointer"
                >
                  <span className="opacity-40">$</span> {p.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedId(null)}
            className="text-[#7fa8ff] mb-2 hover:underline cursor-pointer"
          >
            ← volver
          </button>
          <p className="font-semibold mb-1">{active.name}</p>
          <p className="opacity-80 leading-snug">{active.description}</p>
        </>
      )}
    </div>
  )
}
