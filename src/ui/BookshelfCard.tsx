export default function BookshelfCard() {
  return (
    <div className="w-[260px] bg-[#f5ecd9] text-[#2b2013] rounded-sm shadow-xl p-4 font-serif border border-[#d8c9a3]">
      <h2 className="text-sm tracking-wide uppercase mb-2 border-b border-[#d8c9a3] pb-1">
        Sobre mí
      </h2>
      <p className="text-[11px] leading-relaxed mb-3">
        Desarrollador enfocado en experiencias interactivas y productos con IA.
      </p>

      <h3 className="text-xs font-semibold mb-1">Tecnologías</h3>
      <p className="text-[11px] leading-relaxed mb-3">React · TypeScript · Three.js · Python</p>

      <h3 className="text-xs font-semibold mb-1">Experiencia</h3>
      <p className="text-[11px] leading-relaxed mb-3">Contenido pendiente de definir.</p>

      <h3 className="text-xs font-semibold mb-1">Intereses</h3>
      <p className="text-[11px] leading-relaxed">Música, diseño 3D, producto.</p>
    </div>
  )
}
