export interface Project {
  id: string
  name: string
  description: string
}

export const projects: Project[] = [
  {
    id: 'resume-analyzer',
    name: 'Resume Analyzer',
    description: 'Analiza CVs y ofrece feedback accionable sobre su contenido.',
  },
  {
    id: 'lyric-copilot',
    name: 'Lyric Copilot',
    description: 'Asistente para escribir letras de canciones.',
  },
  {
    id: 'ameliapp',
    name: 'Ameliapp',
    description: 'Contenido pendiente de definir.',
  },
  {
    id: 'coming-soon',
    name: 'Próximos proyectos',
    description: 'Nuevos proyectos en camino.',
  },
]
