import { motion } from 'framer-motion'
import { BarChart3, Globe, Layers, Share2 } from 'lucide-react'

const FEATURES = [
  {
    icon: Layers,
    title: 'Portafolio profesional',
    desc: 'Proyectos, habilidades, experiencias y certificaciones en un solo lugar.',
  },
  {
    icon: Share2,
    title: 'Enlace público',
    desc: 'Comparte tu portafolio con reclutadores y clientes con un link personalizado.',
  },
  {
    icon: BarChart3,
    title: 'Analítica de visitas',
    desc: 'Conoce cuántas personas visitan tu portafolio y qué secciones generan más interés.',
  },
  {
    icon: Globe,
    title: 'Visibilidad global',
    desc: 'Aparece en el directorio público y que más personas descubran tu talento.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
}

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold text-[#1e2a5e] uppercase tracking-widest mb-2">¿Qué es Dev Linked?</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Todo lo que necesitas para destacar
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i + 1}
              variants={fadeUp}
              className="flex flex-col gap-3 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1e2a5e]/10 flex items-center justify-center">
                <f.icon size={18} className="text-[#1e2a5e]" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
