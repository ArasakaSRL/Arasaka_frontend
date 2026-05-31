import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { getPortafolios } from '@/features/sendGmail/api/sendGmail'
import type { Portafolio } from '@/features/portafolio/types/portafolioType'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
}

export default function PortafoliosPreview() {
  const [portafolios, setPortafolios] = useState<Portafolio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPortafolios()
      .then(data => setPortafolios(data.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const preview = portafolios.slice(0, 3)

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold text-[#1e2a5e] uppercase tracking-widest mb-2">Comunidad</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Portafolios destacados
          </h2>
          <p className="text-slate-500 mt-2 text-sm">Los más visitados de nuestra comunidad</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preview.map((p, i) => (
              <PreviewCard key={p.id} portafolio={p} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={1}
          variants={fadeUp}
          className="flex justify-center mt-10"
        >
          <Link
            to="/explorar"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1e2a5e] text-white font-semibold text-sm hover:bg-[#151d45] transition-all shadow-md no-underline active:scale-95"
          >
            Ver todos los portafolios
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function PreviewCard({ portafolio: p, index: i }: { portafolio: Portafolio; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      whileHover={{ y: -5 }}
      className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3">
        {p.usuario?.foto_perfil ? (
          <img
            src={p.usuario.foto_perfil}
            alt={p.usuario.nombre}
            className="w-14 h-14 rounded-2xl object-cover shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#1e2a5e] to-[#27496e] flex items-center justify-center text-white font-bold text-xl shrink-0">
            {p.usuario?.nombre?.charAt(0)?.toUpperCase() ?? p.nombre.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug">{p.nombre}</h3>
          {p.usuario && (
            <p className="text-xs text-[#1e2a5e] font-medium mt-0.5">
              {p.usuario.nombre} {p.usuario.apellido}
            </p>
          )}
        </div>
      </div>

      {p.descripcion && (
        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{p.descripcion}</p>
      )}

      {p.usuario?.profesiones?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {p.usuario.profesiones.slice(0, 2).map(prof => (
            <span key={prof.id_profesion} className="px-2.5 py-1 bg-[#1e2a5e]/8 text-[#1e2a5e] text-[11px] rounded-full font-semibold">
              {prof.nombre}
            </span>
          ))}
        </div>
      )}

      <Link
        to={`/portafolio/${p.slug}`}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#1e2a5e] hover:underline no-underline mt-auto pt-3 border-t border-gray-100"
      >
        <ExternalLink size={14} />
        Ver portafolio
      </Link>
    </motion.div>
  )
}
