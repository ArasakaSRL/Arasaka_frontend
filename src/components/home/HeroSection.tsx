import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, LayoutDashboard, Sparkles, Zap } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function HeroSection() {
  const isLoggedIn = !!useAuthStore(s => s.user)

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#0d1535] pt-32 pb-24 px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#1e2a5e]/60 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#27496e]/50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-6"
        >
          <Sparkles size={12} className="text-yellow-300" />
          Plataforma de portafolios profesionales
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight"
        >
          Tu portafolio,{' '}
          <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            tu marca
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="text-white/60 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Dev Linked te permite crear un portafolio digital profesional en minutos.
          Muestra tus proyectos y habilidades al mundo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {isLoggedIn ? (
            <Link
              to="/Dashboard/perfil/General"
              className="flex mt-10 items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#1e2a5e] font-bold text-sm hover:bg-gray-50 transition-all shadow-lg no-underline active:scale-95"
            >
              <LayoutDashboard size={16} />
              Ir al Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth/Register"
                className="flex mt-10 items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#1e2a5e] font-bold text-sm hover:bg-gray-50 transition-all shadow-lg no-underline active:scale-95"
              >
                <Zap size={16} />
                Comenzar gratis
              </Link>
              <Link
                to="/auth/Login"
                className="flex items-center mt-10 gap-2 px-7 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all no-underline"
              >
                Iniciar sesión
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
