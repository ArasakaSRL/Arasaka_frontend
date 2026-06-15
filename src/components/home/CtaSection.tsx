import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Zap } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
}

export default function CtaSection() {
  const user = useAuthStore(s => s.user)
  const isLoggedIn = !!user
  const esAdmin = user?.rol === 'admin'

  return (
    <section className="py-20 bg-white text-center px-6">
      <div className="max-w-xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-slate-900"
        >
          {isLoggedIn ? '¡Bienvenido de nuevo!' : '¿Listo para crear tu portafolio?'}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={1}
          variants={fadeUp}
          className="text-slate-500 mb-7 text-sm"
        >
          {isLoggedIn
            ? 'Continúa gestionando tus proyectos desde el dashboard.'
            : 'Únete a nuestra comunidad de profesionales y destaca ante el mundo.'}
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={2}
          variants={fadeUp}
        >
          {isLoggedIn ? (
            <Link
              to={esAdmin ? "/Dashboard/admin/Perfiles" : "/Dashboard/perfil/General"}
              className="inline-flex items-center mt-5 gap-2 bg-[#1e2a5e] text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#151d45] transition-all no-underline shadow-lg shadow-indigo-900/20"
            >
              <LayoutDashboard size={16} />
              Ir al Dashboard
            </Link>
          ) : (
            <Link
              to="/auth/Register"
              className="inline-flex items-center mt-5 gap-2 bg-[#1e2a5e] text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#151d45] transition-all no-underline shadow-lg shadow-indigo-900/20"
            >
              <Zap size={16} />
              Empezar gratis
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
