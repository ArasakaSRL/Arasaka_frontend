import { motion } from 'framer-motion'
import { Heart, Lightbulb, Users } from 'lucide-react'

const VALORES = [
  {
    icon: Lightbulb,
    title: 'Simplicidad',
    desc: 'Nuestro editor es intuitivo para que te enfoques en tu contenido, no en la tecnología.',
  },
  {
    icon: Users,
    title: 'Comunidad',
    desc: 'Somos una red de profesionales que se apoyan mutuamente. Tu visibilidad impulsa la de los demás.',
  },
  {
    icon: Heart,
    title: 'Propósito',
    desc: 'Nacimos para democratizar el acceso a herramientas profesionales de calidad, sin importar dónde estés.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
}

export default function NosotrosSection() {
  return (
    <section id="nosotros" className="py-20 px-6 bg-[#0d1535] scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#1e2a5e]/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-[#27496e]/50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* texto izquierda */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Nosotros</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-5">
              Construido por y para profesionales
            </h2>
            <p className="text-white/55 text-sm leading-relaxed mb-4">
              Dev Linked nació de una necesidad real: crear una plataforma donde desarrolladores, diseñadores y
              profesionales de tecnología puedan presentar su trabajo de forma elegante, sin necesidad de
              conocimientos avanzados en diseño web.
            </p>
            <p className="text-white/55 text-sm leading-relaxed">
              Hoy somos una plataforma en crecimiento que conecta talento con oportunidades,
              permitiendo que cada profesional tenga su espacio digital propio y único.
            </p>
          </motion.div>

          {/* valores derecha */}
          <div className="flex flex-col gap-4">
            {VALORES.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i + 1}
                variants={fadeUp}
                className="flex gap-4 items-start p-4 rounded-2xl bg-white/6 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <v.icon size={17} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{v.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
