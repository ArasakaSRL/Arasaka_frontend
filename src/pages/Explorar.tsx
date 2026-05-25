import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, ExternalLink, FolderOpen, X,
  Search, SlidersHorizontal, Globe, Briefcase, Code2,
  Languages, ChevronDown, ChevronUp, ArrowUpDown, MapPin,
  Layers, Star,
} from 'lucide-react'
import WelcomeLayout from '@/layout/welcomeLayout'
import {
  getPortafoliosFiltrados,
  getCatalogosPublicos,
  type SortKey,
  type CatalogosPublicos,
  type PaginatedPortafolios,
} from '@/features/sendGmail/api/sendGmail'
import type { Portafolio } from '@/features/portafolio/types/portafolioType'

const POR_PAGINA = 9

// ── helpers ──────────────────────────────────────────────────────────────────

function FilterSection({
  label, icon, children, defaultOpen = true,
}: { label: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full py-1 group"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-[#1e2a5e] transition-colors">
          {icon}{label}
        </span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
        active
          ? 'bg-[#1e2a5e] text-white border-[#1e2a5e] shadow-sm'
          : 'bg-white text-slate-600 border-gray-200 hover:border-[#1e2a5e] hover:text-[#1e2a5e]'
      }`}
    >
      {label}
    </button>
  )
}

// ── sidebar ───────────────────────────────────────────────────────────────────

type SidebarProps = {
  catalogos: CatalogosPublicos | null
  loadingCatalogos: boolean
  filtroPais: string | null
  filtroProfesion: string | null
  filtroTecnologia: string | null
  filtroIdioma: string | null
  ordenar: SortKey
  activeFiltersCount: number
  mostrarMasTec: boolean
  mostrarMasProf: boolean
  setMostrarMasTec: (v: boolean | ((p: boolean) => boolean)) => void
  setMostrarMasProf: (v: boolean | ((p: boolean) => boolean)) => void
  onSetPais: (v: string | null) => void
  onSetProfesion: (v: string | null) => void
  onSetTecnologia: (v: string | null) => void
  onSetIdioma: (v: string | null) => void
  onSetOrdenar: (v: SortKey) => void
  onClearAll: () => void
}

function SidebarContent({
  catalogos, loadingCatalogos,
  filtroPais, filtroProfesion, filtroTecnologia, filtroIdioma, ordenar,
  activeFiltersCount, mostrarMasTec, mostrarMasProf,
  setMostrarMasTec, setMostrarMasProf,
  onSetPais, onSetProfesion, onSetTecnologia, onSetIdioma, onSetOrdenar, onClearAll,
}: SidebarProps) {
  const tecnologias = catalogos?.tecnologias ?? []
  const profesiones = catalogos?.profesiones ?? []
  const paises = catalogos?.paises ?? []
  const idiomas = catalogos?.idiomas ?? []

  const tecVisible = mostrarMasTec ? tecnologias : tecnologias.slice(0, 12)
  const profVisible = mostrarMasProf ? profesiones : profesiones.slice(0, 8)

  if (loadingCatalogos) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-slate-800">Filtros</span>
        {activeFiltersCount > 0 && (
          <button onClick={onClearAll} className="text-xs text-[#1e2a5e] font-medium hover:underline">
            Limpiar todo
          </button>
        )}
      </div>

      {/* Ordenar */}
      <FilterSection label="Ordenar por" icon={<ArrowUpDown size={14} />}>
        <div className="flex flex-col gap-1.5">
          {([
            { value: 'nombre_asc', label: 'Nombre A–Z' },
            { value: 'nombre_desc', label: 'Nombre Z–A' },
            { value: 'proyectos', label: 'Más proyectos' },
            { value: 'habilidades', label: 'Más habilidades' },
          ] as { value: SortKey; label: string }[]).map(opt => (
            <button
              key={opt.value}
              onClick={() => onSetOrdenar(opt.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                ordenar === opt.value
                  ? 'bg-[#1e2a5e] text-white font-medium'
                  : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              {ordenar === opt.value && <Star size={12} />}
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* País */}
      {paises.length > 0 && (
        <FilterSection label="País" icon={<MapPin size={14} />}>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => onSetPais(null)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                filtroPais === null ? 'bg-[#1e2a5e] text-white font-medium' : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              {filtroPais === null && <Star size={12} />} Todos los países
            </button>
            {paises.map(pais => (
              <button
                key={pais}
                onClick={() => onSetPais(pais)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  filtroPais === pais ? 'bg-[#1e2a5e] text-white font-medium' : 'text-slate-600 hover:bg-gray-50'
                }`}
              >
                <Globe size={12} className="shrink-0" />
                {pais}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Profesión */}
      {profesiones.length > 0 && (
        <FilterSection label="Profesión" icon={<Briefcase size={14} />}>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="Todas" active={filtroProfesion === null} onClick={() => onSetProfesion(null)} />
            {profVisible.map(prof => (
              <FilterChip
                key={prof.id_profesion}
                label={prof.nombre}
                active={filtroProfesion === prof.nombre}
                onClick={() => onSetProfesion(prof.nombre)}
              />
            ))}
            {profesiones.length > 8 && (
              <button
                onClick={() => setMostrarMasProf(v => !v)}
                className="text-xs text-[#1e2a5e] font-medium hover:underline mt-1"
              >
                {mostrarMasProf ? 'Ver menos' : `+${profesiones.length - 8} más`}
              </button>
            )}
          </div>
        </FilterSection>
      )}

      {/* Tecnologías */}
      {tecnologias.length > 0 && (
        <FilterSection label="Tecnologías" icon={<Code2 size={14} />}>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="Todas" active={filtroTecnologia === null} onClick={() => onSetTecnologia(null)} />
            {tecVisible.map(tec => (
              <FilterChip key={tec} label={tec} active={filtroTecnologia === tec} onClick={() => onSetTecnologia(tec)} />
            ))}
            {tecnologias.length > 12 && (
              <button
                onClick={() => setMostrarMasTec(v => !v)}
                className="text-xs text-[#1e2a5e] font-medium hover:underline mt-1"
              >
                {mostrarMasTec ? 'Ver menos' : `+${tecnologias.length - 12} más`}
              </button>
            )}
          </div>
        </FilterSection>
      )}

      {/* Idiomas */}
      {idiomas.length > 0 && (
        <FilterSection label="Idiomas" icon={<Languages size={14} />}>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="Todos" active={filtroIdioma === null} onClick={() => onSetIdioma(null)} />
            {idiomas.map(idioma => (
              <FilterChip
                key={idioma.id_idioma}
                label={idioma.nombre}
                active={filtroIdioma === idioma.nombre}
                onClick={() => onSetIdioma(idioma.nombre)}
              />
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function Explorar() {
  const [resultado, setResultado] = useState<PaginatedPortafolios | null>(null)
  const [loading, setLoading] = useState(true)
  const [catalogos, setCatalogos] = useState<CatalogosPublicos | null>(null)
  const [loadingCatalogos, setLoadingCatalogos] = useState(true)

  // filtros
  const [busqueda, setBusqueda] = useState('')
  const [busquedaDebounced, setBusquedaDebounced] = useState('')
  const [filtroProfesion, setFiltroProfesion] = useState<string | null>(null)
  const [filtroPais, setFiltroPais] = useState<string | null>(null)
  const [filtroTecnologia, setFiltroTecnologia] = useState<string | null>(null)
  const [filtroIdioma, setFiltroIdioma] = useState<string | null>(null)
  const [ordenar, setOrdenar] = useState<SortKey>('nombre_asc')
  const [pagina, setPagina] = useState(1)

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [mostrarMasTec, setMostrarMasTec] = useState(false)
  const [mostrarMasProf, setMostrarMasProf] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // carga catálogos una sola vez al montar
  useEffect(() => {
    getCatalogosPublicos()
      .then(setCatalogos)
      .catch(() => {})
      .finally(() => setLoadingCatalogos(false))
  }, [])

  // debounce de búsqueda: 500 ms
  useEffect(() => {
    const t = setTimeout(() => setBusquedaDebounced(busqueda), 500)
    return () => clearTimeout(t)
  }, [busqueda])

  // cada vez que cambia cualquier filtro, resetear página
  useEffect(() => {
    setPagina(1)
  }, [busquedaDebounced, filtroProfesion, filtroPais, filtroTecnologia, filtroIdioma, ordenar])

  // llamada a la API cada vez que cambian filtros o página
  useEffect(() => {
    setLoading(true)
    getPortafoliosFiltrados({
      busqueda: busquedaDebounced || undefined,
      profesion: filtroProfesion ?? undefined,
      pais: filtroPais ?? undefined,
      tecnologia: filtroTecnologia ?? undefined,
      idioma: filtroIdioma ?? undefined,
      orden: ordenar,
      por_pagina: POR_PAGINA,
      page: pagina,
    })
      .then(setResultado)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [busquedaDebounced, filtroProfesion, filtroPais, filtroTecnologia, filtroIdioma, ordenar, pagina])

  const portafolios: Portafolio[] = resultado?.data ?? []
  const totalPaginas = resultado?.meta.last_page ?? 1
  const total = resultado?.meta.total ?? 0

  const activeFilters = [
    filtroProfesion && { key: 'profesion', label: filtroProfesion, clear: () => setFiltroProfesion(null) },
    filtroPais      && { key: 'pais',      label: filtroPais,       clear: () => setFiltroPais(null) },
    filtroTecnologia && { key: 'tec',     label: filtroTecnologia,  clear: () => setFiltroTecnologia(null) },
    filtroIdioma    && { key: 'idioma',    label: filtroIdioma,      clear: () => setFiltroIdioma(null) },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[]

  function clearAll() {
    setFiltroProfesion(null); setFiltroPais(null)
    setFiltroTecnologia(null); setFiltroIdioma(null)
    setBusqueda(''); setBusquedaDebounced('')
  }

  function cambioPagina(n: number) {
    setPagina(n)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSetFiltro(
    tipo: 'pais' | 'profesion' | 'tecnologia' | 'idioma' | 'ordenar',
    valor: string | null,
  ) {
    if (tipo === 'pais')       setFiltroPais(valor)
    else if (tipo === 'profesion')  setFiltroProfesion(valor)
    else if (tipo === 'tecnologia') setFiltroTecnologia(valor)
    else if (tipo === 'idioma')     setFiltroIdioma(valor)
    else if (tipo === 'ordenar')    setOrdenar(valor as SortKey)
  }

  const sidebarProps: SidebarProps = {
    catalogos, loadingCatalogos,
    filtroPais, filtroProfesion, filtroTecnologia, filtroIdioma, ordenar,
    activeFiltersCount: activeFilters.length,
    mostrarMasTec, mostrarMasProf,
    setMostrarMasTec, setMostrarMasProf,
    onSetPais:       v => handleSetFiltro('pais', v),
    onSetProfesion:  v => handleSetFiltro('profesion', v),
    onSetTecnologia: v => handleSetFiltro('tecnologia', v),
    onSetIdioma:     v => handleSetFiltro('idioma', v),
    onSetOrdenar:    v => handleSetFiltro('ordenar', v),
    onClearAll: clearAll,
  }

  return (
    <WelcomeLayout>
      <div className="pt-24 pb-20 min-h-screen bg-gray-50">

       
        <div className="bg-white border-b  border-gray-100 px-6 py-8">
          <div className="max-w-7xl justify-content mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                Explorar portafolios
              </h1>
              <p className="text-slate-500 text-sm mb-6">
                Descubrí el talento que necesitás para tu empresa
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="relative max-w-2xl  mx-auto "
            >
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, profesión, servicio…"
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-slate-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#1e2a5e]/25 focus:border-[#1e2a5e] transition-all shadow-sm"
              />
              {busqueda && (
                <button
                  onClick={() => { setBusqueda(''); setBusquedaDebounced('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="flex gap-8">

            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <SidebarContent {...sidebarProps} />
              </div>
            </aside>

        
            <div className="flex-1 min-w-0">

              <div className="flex items-center justify-between mb-4 gap-3" ref={gridRef}>
                <p className="text-sm text-slate-500">
                  {loading ? (
                    <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <span>
                      <span className="font-semibold text-slate-800">{total}</span>
                      {' '}portafolio{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:border-[#1e2a5e] transition-colors"
                >
                  <SlidersHorizontal size={15} />
                  Filtros
                  {activeFilters.length > 0 && (
                    <span className="ml-1 bg-[#1e2a5e] text-white text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
              </div>

      
              <AnimatePresence>
                {activeFilters.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 mb-5"
                  >
                    {activeFilters.map(f => (
                      <span
                        key={f.key}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e2a5e]/10 text-[#1e2a5e] text-xs font-medium rounded-full"
                      >
                        {f.label}
                        <button onClick={f.clear} className="hover:text-red-500 transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600 px-2 underline underline-offset-2">
                      Limpiar todo
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

       
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(POR_PAGINA)].map((_, i) => (
                    <div key={i} className="h-52 rounded-2xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : portafolios.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 gap-4 text-gray-400">
                  <FolderOpen size={52} strokeWidth={1.2} />
                  <div className="text-center">
                    <p className="text-base font-medium text-slate-500">No se encontraron portafolios</p>
                    <p className="text-sm text-gray-400 mt-1">Probá ajustando los filtros o la búsqueda</p>
                  </div>
                  {activeFilters.length > 0 && (
                    <button onClick={clearAll} className="mt-2 px-5 py-2 bg-[#1e2a5e] text-white text-sm font-medium rounded-xl hover:bg-[#27496e] transition-colors">
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {portafolios.map((p, i) => {
                    const todasTec = [
                      ...(p.proyectos?.flatMap(pr => pr.tecnologias?.map(t => t.nombre) ?? []) ?? []),
                      ...(p.habilidades?.tecnicas?.flatMap(h => h.tecnologias?.map(t => t.nombre) ?? []) ?? []),
                    ]
                    const tecUnicas = [...new Set(todasTec)].slice(0, 4)
                    const numProyectos = p.proyectos?.length ?? 0
                    const numHabilidades = (p.habilidades?.tecnicas?.length ?? 0) + (p.habilidades?.blandas?.length ?? 0)
                    const foto = p.usuario?.foto_perfil || p.informacion_basica?.foto_perfil

                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        whileHover={{ y: -3 }}
                        className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                      >
                        <div className="h-1 bg-linear-to-r from-[#1e2a5e] to-[#4a7fc1] w-full" />

                        <div className="p-5 flex flex-col gap-3 flex-1">
                          {/* Header */}
                          <div className="flex items-start gap-3">
                            {foto ? (
                              <img
                                src={foto}
                                alt={p.usuario?.nombre ?? p.nombre}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#1e2a5e] to-[#4a7fc1] flex items-center justify-center text-white font-bold text-lg shrink-0">
                                {(p.usuario?.nombre ?? p.nombre).charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-900 text-sm leading-tight truncate group-hover:text-[#1e2a5e] transition-colors">
                                {p.nombre}
                              </h3>
                              {p.usuario && (
                                <p className="text-[12px] text-[#1e2a5e] font-medium truncate">
                                  {p.usuario.nombre}
                                </p>
                              )}
                              {p.usuario?.pais && (
                                <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                                  <Globe size={10} />{p.usuario.pais}
                                </p>
                              )}
                            </div>
                          </div>

                          
                          {(p.usuario?.profesiones?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {p.usuario.profesiones.slice(0, 2).map(prof => (
                                <span key={prof.id_profesion} className="px-2 py-0.5 bg-[#1e2a5e]/8 text-[#1e2a5e] text-[11px] rounded-full font-medium border border-[#1e2a5e]/15">
                                  {prof.nombre}
                                </span>
                              ))}
                              {p.usuario.profesiones.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[11px] rounded-full font-medium">
                                  +{p.usuario.profesiones.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          {p.descripcion && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.descripcion}</p>
                          )}

                     
                          {tecUnicas.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Code2 size={12} className="text-gray-400 shrink-0" />
                              {tecUnicas.map(t => (
                                <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded font-mono">
                                  {t}
                                </span>
                              ))}
                              {[...new Set(todasTec)].length > 4 && (
                                <span className="text-[10px] text-gray-400">+{[...new Set(todasTec)].length - 4}</span>
                              )}
                            </div>
                          )}

                     
                          {(p.usuario?.idiomas?.length ?? 0) > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Languages size={12} className="text-gray-400 shrink-0" />
                              {p.usuario.idiomas.slice(0, 3).map(idioma => (
                                <span key={idioma} className="text-[11px] text-gray-500 font-medium">{idioma}</span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                            <div className="flex items-center gap-3 text-[11px] text-gray-400">
                              {numProyectos > 0 && (
                                <span className="flex items-center gap-1">
                                  <Layers size={11} />{numProyectos} {numProyectos === 1 ? 'proyecto' : 'proyectos'}
                                </span>
                              )}
                              {numHabilidades > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star size={11} />{numHabilidades} habilidades
                                </span>
                              )}
                            </div>
                            <Link
                              to={`/portafolio/${p.slug}`}
                              className="flex items-center gap-1 text-xs font-semibold text-[#1e2a5e] hover:underline no-underline"
                            >
                              <ExternalLink size={13} />Ver portafolio
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

          
              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => cambioPagina(pagina - 1)}
                    disabled={pagina === 1}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#1e2a5e] border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />Anterior
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                      .filter(n => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1)
                      .reduce<(number | '…')[]>((acc, n, idx, arr) => {
                        if (idx > 0 && (n as number) - (arr[idx - 1] as number) > 1) acc.push('…')
                        acc.push(n); return acc
                      }, [])
                      .map((item, idx) =>
                        item === '…'
                          ? <span key={`e${idx}`} className="px-1 text-gray-400 text-sm">…</span>
                          : (
                            <button
                              key={item}
                              onClick={() => cambioPagina(item as number)}
                              className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${
                                pagina === item ? 'bg-[#1e2a5e] text-white' : 'text-slate-600 hover:bg-gray-100'
                              }`}
                            >
                              {item}
                            </button>
                          )
                      )}
                  </div>
                  <button
                    onClick={() => cambioPagina(pagina + 1)}
                    disabled={pagina === totalPaginas}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#1e2a5e] border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente<ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

   
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <SlidersHorizontal size={16} />Filtros
                </span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5">
                <SidebarContent {...sidebarProps} />
              </div>
              <div className="p-5 border-t border-gray-100">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-[#1e2a5e] text-white text-sm font-semibold rounded-xl hover:bg-[#27496e] transition-colors"
                >
                  Ver {total} resultado{total !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </WelcomeLayout>
  )
}
