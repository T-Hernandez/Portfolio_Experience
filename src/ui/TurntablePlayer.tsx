import { nowPlaying } from '../content/music'

export default function TurntablePlayer() {
  return (
    <div className="w-[220px] bg-[#1a1a1a] text-[#e8dcc4] rounded-md p-3 shadow-2xl border border-[#3a3a3a]">
      <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-2">Ahora sonando</p>
      <p className="text-sm font-medium mb-3">{nowPlaying.title}</p>
      <div className="flex items-center gap-2">
        <button className="w-7 h-7 rounded-full bg-[#e8dcc4] text-[#1a1a1a] flex items-center justify-center text-xs cursor-pointer">
          ▶
        </button>
        <div className="flex-1 h-[2px] bg-[#3a3a3a] rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-[#e8dcc4]" />
        </div>
      </div>
    </div>
  )
}
