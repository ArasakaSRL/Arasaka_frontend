import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, FolderOpen, X } from 'lucide-react'
import WelcomeLayout from '@/layout/welcomeLayout'
import { getPortafolios } from '@/features/sendGmail/api/sendGmail'
import type { Portafolio } from '@/features/portafolio/types/portafolioType'

const POR_PAGINA = 9

export default function Home() {
  const [portafolios, setPortafolios] = useState<Portafolio[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroProfesion, setFiltroProfesion] = useState<string | null>(null)
  const [filtroPais, setFiltroPais] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    // El backend devuelve los portafolios ordenados por visitas descendente
    getPortafolios()
      .then(data => setPortafolios(data.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const profesiones = useMemo(() => {
    const set = new Set<string>()
    portafolios.forEach(p => p.usuario?.profesiones?.forEach(pr => set.add(pr.nombre)))
    return [...set].sort()
  }, [portafolios])

  const paises = useMemo(() => {
    const set = new Set<string>()
    portafolios.forEach(p => { if (p.usuario?.pais) set.add(p.usuario.pais) })
    return [...set].sort()
  }, [portafolios])

  const filtrados = portafolios.filter(p => {
    const coincideProfesion = !filtroProfesion || p.usuario?.profesiones?.some(pr => pr.nombre === filtroProfesion)
    const coincidePais = !filtroPais || p.usuario?.pais === filtroPais
    return coincideProfesion && coincidePais
  })

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA)
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  function setFiltro(tipo: 'profesion' | 'pais', valor: string | null) {
    if (tipo === 'profesion') setFiltroProfesion(valor)
    else setFiltroPais(valor)
    setPagina(1)
  }

  return (
    <WelcomeLayout>

      <section className="py-24 bg-linear-to-br from-[#1e2a5e] to-[#27496e] text-white text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
        >
          Portafolios Digitales
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/70 text-lg mb-8 max-w-xl mx-auto"
        >
          Descubre los portafolios de nuestra comunidad de profesionales
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/auth/Register"
            className="bg-white text-[#1e2a5e] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all no-underline"
          >
            Crear mi portafolio
          </Link>
        </motion.div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#1e2a5e]">Portafolios públicos</h2>
            {paises.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  value={filtroPais ?? ''}
                  onChange={e => setFiltro('pais', e.target.value || null)}
                  className="text-sm rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#1e2a5e]/30 focus:border-[#1e2a5e] text-slate-700"
                >
                  <option value="">Todos los países</option>
                  {paises.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {filtroPais && (
                  <button onClick={() => setFiltro('pais', null)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {profesiones.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltro('profesion', null)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  filtroProfesion === null
                    ? 'bg-[#1e2a5e] text-white border-[#1e2a5e]'
                    : 'bg-white text-slate-600 border-gray-200 hover:border-[#1e2a5e] hover:text-[#1e2a5e]'
                }`}
              >
                Todas
              </button>
              {profesiones.map(prof => (
                <button
                  key={prof}
                  onClick={() => setFiltro('profesion', prof)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    filtroProfesion === prof
                      ? 'bg-[#1e2a5e] text-white border-[#1e2a5e]'
                      : 'bg-white text-slate-600 border-gray-200 hover:border-[#1e2a5e] hover:text-[#1e2a5e]'
                  }`}
                >
                  {prof}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <FolderOpen size={48} strokeWidth={1.2} />
            <p className="text-sm">No se encontraron portafolios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginados.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="flex flex-col gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
           
                <div className="flex items-center gap-3">
                  {p.usuario?.foto_perfil ? (
                    <img
                      src={p.usuario.foto_perfil}
                      alt={p.usuario.nombre}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#1e2a5e] to-[#27496e] flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {p.usuario?.nombre?.charAt(0)?.toUpperCase() ?? p.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{p.nombre}</h3>
                    {p.usuario && (
                      <p className="text-[12px] text-[#1e2a5e] font-medium">
                        {p.usuario.nombre} {p.usuario.apellido}
                      </p>
                    )}
                  </div>
                </div>

                {p.descripcion && (
                  <p className="text-sm text-slate-500 line-clamp-2">{p.descripcion}</p>
                )}

            
                {p.usuario?.profesiones?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.usuario.profesiones.slice(0, 2).map(prof => (
                      <span key={prof.id_profesion} className="px-2 py-0.5 bg-[#1e2a5e]/10 text-[#1e2a5e] text-[11px] rounded-full font-medium">
                        {prof.nombre}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  to={`/portafolio/${p.slug}`}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#1e2a5e] hover:underline no-underline self-start mt-auto"
                >
                  <ExternalLink size={14} />
                  Ver portafolio
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setPagina(p => p - 1)}
              disabled={pagina === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#1e2a5e] border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
            <span className="text-sm text-gray-500">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina(p => p + 1)}
              disabled={pagina === totalPaginas}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#1e2a5e] border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

     
      <section className="py-20 bg-[#1e2a5e] text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">
          ¿Listo para gestionar tu portafolio?
        </h2>
        <p className="text-white/70 mb-8">Únete a nuestra comunidad de profesionales</p>
        <Link
          to="/auth/Register"
          className="bg-white text-[#1e2a5e] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all no-underline"
        >
          Empezar Ahora
        </Link>
      </section>

    </WelcomeLayout>
  )
}
