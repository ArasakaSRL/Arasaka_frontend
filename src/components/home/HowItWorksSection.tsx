import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, PencilLine, UserPlus } from 'lucide-react'

const STEPS = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Crea tu cuenta',
    desc: 'Regístrate gratis en segundos. Solo necesitas un correo y una contraseña para empezar.',
  },
  {
    icon: PencilLine,
    step: '02',
    title: 'Completa tu perfil',
    desc: 'Agrega tus proyectos, habilidades, experiencias y certificaciones con nuestro editor intuitivo.',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Comparte al mundo',
    desc: 'Activa la visibilidad pública y comparte tu enlace personalizado con reclutadores y clientes.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
}

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 px-6 bg-[#0d1535] scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Proceso</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Listo en 3 pasos
          </h2>
          <p className="text-white/50 mt-2 text-sm max-w-md mx-auto">
            Sin complicaciones. Tu portafolio profesional en minutos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* línea conectora desktop */}
          <div className="hidden md:block absolute top-10 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-white/10" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i + 1}
              variants={fadeUp}
              className="relative flex flex-col items-center text-center gap-4 p-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white/8 border border-white/12 flex items-center justify-center">
                  <s.icon size={26} className="text-blue-400" />
                </div>
                <span className="absolute -top-2 -right-2 text-[10px] font-bold text-white/40 bg-[#0d1535] px-1">
                  {s.step}
                </span>
              </div>
              <h3 className="font-bold text-white text-base">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight size={16} className="md:hidden text-white/20 mt-1" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
