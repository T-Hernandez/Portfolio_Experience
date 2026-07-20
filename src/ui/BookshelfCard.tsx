import { aboutSections } from '../content/about'

export default function BookshelfCard() {
  return (
    <div className="w-[260px] bg-[#f5ecd9] text-[#2b2013] rounded-sm shadow-xl p-4 font-serif border border-[#d8c9a3]">
      {aboutSections.map((section, i) => (
        <div key={section.title} className={i > 0 ? 'mt-3' : ''}>
          <h3
            className={
              i === 0
                ? 'text-sm tracking-wide uppercase mb-2 border-b border-[#d8c9a3] pb-1'
                : 'text-xs font-semibold mb-1'
            }
          >
            {section.title}
          </h3>
          <p className="text-[11px] leading-relaxed">{section.body}</p>
        </div>
      ))}
    </div>
  )
}
