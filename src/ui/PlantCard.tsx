import { contactLinks } from '../content/contact'

export default function PlantCard() {
  return (
    <div className="w-[200px] bg-[#fffdf8] text-[#233023] rounded-sm shadow-xl p-3 text-xs border border-[#d7ddce]">
      <p className="uppercase tracking-widest text-[9px] opacity-60 mb-2">Contacto</p>
      <ul className="space-y-1.5">
        {contactLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noreferrer" className="hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
