import { useEffect, useRef, useState } from 'react'
import { X, Flag, Search, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getEtiquetas, denunciarPortafolio } from '../api/denunciaApi'
import type { EtiquetaDenuncia } from '../types/denunciaType'

interface Props {
    open: boolean
    onClose: () => void
    idPortafolio: string
}

export default function DenunciarModal({ open, onClose, idPortafolio }: Props) {
    const [etiquetas, setEtiquetas] = useState<EtiquetaDenuncia[]>([])
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState<EtiquetaDenuncia | null>(null)
    const [busqueda, setBusqueda] = useState('')
    const [dropdownAbierto, setDropdownAbierto] = useState(false)
    const [motivo, setMotivo] = useState('')
    const [loading, setLoading] = useState(false)
    const [enviado, setEnviado] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const etiquetasFiltradas = etiquetas.filter(e =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )

    useEffect(() => {
        if (open && etiquetas.length === 0) {
            getEtiquetas().then(setEtiquetas).catch(() => {})
        }
    }, [open])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownAbierto(false)
                setBusqueda('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function handleClose() {
        onClose()
        setTimeout(() => {
            setEtiquetaSeleccionada(null)
            setBusqueda('')
            setDropdownAbierto(false)
            setMotivo('')
            setEnviado(false)
            setError(null)
        }, 300)
    }

    function seleccionarEtiqueta(etiqueta: EtiquetaDenuncia) {
        setEtiquetaSeleccionada(etiqueta)
        setDropdownAbierto(false)
        setBusqueda('')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!etiquetaSeleccionada) return
        setLoading(true)
        setError(null)
        try {
            await denunciarPortafolio(idPortafolio, {
                id_etiqueta_denuncia: etiquetaSeleccionada.id_etiqueta_denuncia,
                motivo,
            })
            setEnviado(true)
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            setError(msg ?? 'No se pudo enviar la denuncia. Intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#0a1120] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <div className="flex items-center gap-2 text-white font-bold text-base">
                                <Flag size={16} className="text-red-400" />
                                Denunciar portafolio
                            </div>
                            <button onClick={handleClose} className="text-white/40 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6">
                            {enviado ? (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                                        <Check size={22} className="text-green-400" />
                                    </div>
                                    <p className="text-white font-semibold text-lg mb-1">Denuncia enviada</p>
                                    <p className="text-white/50 text-sm">Gracias por ayudarnos a mantener la plataforma segura.</p>
                                    <button
                                        onClick={handleClose}
                                        className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-white/60 text-left! text-xs font-medium uppercase tracking-wide">
                                            Motivo de la denuncia *
                                        </label>
                                        <div ref={dropdownRef} className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setDropdownAbierto(p => !p)}
                                                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-sm rounded-xl transition-colors"
                                            >
                                                <span className={etiquetaSeleccionada ? 'text-white' : 'text-white/30'}>
                                                    {etiquetaSeleccionada ? etiquetaSeleccionada.nombre : 'Selecciona una etiqueta'}
                                                </span>
                                                <ChevronDown
                                                    size={16}
                                                    className={`text-white/40 transition-transform ${dropdownAbierto ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {dropdownAbierto && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -6 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute top-full mt-2 w-full bg-[#0f1a2e] border border-white/10 rounded-xl shadow-2xl z-10 overflow-hidden"
                                                    >
                                                        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/10">
                                                            <Search size={14} className="text-white/30 shrink-0" />
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                value={busqueda}
                                                                onChange={e => setBusqueda(e.target.value)}
                                                                placeholder="Buscar etiqueta..."
                                                                className="bg-transparent text-white text-sm w-full outline-none placeholder:text-white/30"
                                                            />
                                                        </div>

                                                        <div className="max-h-48 overflow-y-auto">
                                                            {etiquetasFiltradas.length === 0 ? (
                                                                <p className="text-white/30 text-sm text-center py-4">Sin resultados</p>
                                                            ) : (
                                                                etiquetasFiltradas.map(e => (
                                                                    <button
                                                                        key={e.id_etiqueta_denuncia}
                                                                        type="button"
                                                                        onClick={() => seleccionarEtiqueta(e)}
                                                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors text-left"
                                                                    >
                                                                        {e.nombre}
                                                                        {etiquetaSeleccionada?.id_etiqueta_denuncia === e.id_etiqueta_denuncia && (
                                                                            <Check size={14} className="text-red-400 shrink-0" />
                                                                        )}
                                                                    </button>
                                                                ))
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-white/60 text-left! text-xs font-medium uppercase tracking-wide">
                                            Descripción *
                                        </label>
                                        <textarea
                                            value={motivo}
                                            onChange={e => setMotivo(e.target.value)}
                                            maxLength={200}
                                            rows={4}
                                            placeholder="Describe con más detalle el problema..."
                                            className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 text-white rounded-xl px-4 py-3 text-sm outline-none resize-none placeholder:text-white/25 transition-colors"
                                        />
                                        <span className="text-white/25 text-xs text-right">{motivo.length}/200</span>
                                    </div>

                                    {error && (
                                        <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2.5 rounded-xl">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !etiquetaSeleccionada || motivo.trim() === ''}
                                        className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors"
                                    >
                                        {loading ? 'Enviando...' : 'Enviar denuncia'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
