import { useEffect, useState } from 'react'
import { Flag, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/layout/DashboardLayout'
import { Banner } from '@/components/Banner'
import { getDenuncias } from '@/features/denuncias/api/adminDenunciaApi'
import type { DenunciaAdmin } from '@/features/denuncias/types/adminDenunciaType'

function Avatar({ nombre, foto }: { nombre: string; foto: string | null }) {
    return foto ? (
        <img src={foto} alt={nombre} className="w-10 h-10 rounded-full object-cover shrink-0" />
    ) : (
        <div className="w-10 h-10 rounded-full bg-[#16266B] text-white flex items-center justify-center text-sm font-bold shrink-0">
            {nombre.split(' ').map(w => w[0]).slice(0, 2).join('')}
        </div>
    )
}

function DetalleDenunciaModal({ denuncia, onClose }: { denuncia: DenunciaAdmin; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4"
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-bold mt-2! text-slate-800 text-base">Detalle de denuncia</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <Avatar nombre={denuncia.portafolio.nombre} foto={denuncia.portafolio.usuario.url_foto} />
                    <div>
                        <p className="font-semibold text-slate-800 text-sm">{denuncia.portafolio.nombre}</p>
                        <p className="text-xs text-slate-400">@{denuncia.portafolio.usuario.username}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Etiqueta</p>
                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-semibold px-2.5 py-1.5 rounded-full self-start">
                            <Flag size={11} /> {denuncia.etiqueta.nombre}
                        </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Descripción</p>
                        <p className="text-sm text-slate-600">
                            {denuncia.motivo ?? <span className="text-slate-300 italic">Sin descripción</span>}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Fecha</p>
                        <p className="text-sm text-slate-600">{new Date(denuncia.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                <button onClick={onClose} className="w-full py-2.5 bg-[#1e2a5e] hover:bg-[#16266B] text-white font-semibold rounded-xl text-sm transition-colors">
                    Cerrar
                </button>
            </motion.div>
        </div>
    )
}

export default function AdminDenuncias() {
    const [denuncias, setDenuncias] = useState<DenunciaAdmin[]>([])
    const [seleccionada, setSeleccionada] = useState<DenunciaAdmin | null>(null)

    useEffect(() => {
        getDenuncias().then(setDenuncias).catch(() => {})
    }, [])

    return (
        <DashboardLayout>
            <Banner titulo="Denuncias" descripcion="Listado de denuncias recibidas en portafolios" />

            <AnimatePresence>
                {seleccionada && (
                    <DetalleDenunciaModal denuncia={seleccionada} onClose={() => setSeleccionada(null)} />
                )}
            </AnimatePresence>

            <p className="mt-4 text-slate-400 text-xs">Haz clic en una denuncia para ver sus detalles.</p>

            <div className="mt-3 flex flex-col gap-2">
                {denuncias.length === 0 && (
                    <p className="text-slate-400 text-sm">No hay denuncias registradas.</p>
                )}
                {denuncias.map(d => (
                    <button
                        key={d.id_denuncia_portafolio}
                        onClick={() => setSeleccionada(d)}
                        className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-left w-full"
                    >
                        {/* Avatar + nombre */}
                        <div className="flex items-center gap-3">
                            <Avatar nombre={d.portafolio.nombre} foto={d.portafolio.usuario.url_foto} />
                            <div className="flex-1 min-w-0 sm:w-36 sm:flex-none">
                                <p className="font-semibold text-slate-800 text-sm truncate">{d.portafolio.nombre}</p>
                                <p className="text-xs text-slate-400">@{d.portafolio.usuario.username}</p>
                            </div>
                        </div>

                        {/* Etiqueta + fecha en mobile: misma fila con justify-between */}
                        <div className="flex items-center justify-between sm:contents">
                            <div className="flex-1 sm:flex sm:justify-center">
                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    <Flag size={10} /> {d.etiqueta.nombre}
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs shrink-0">
                                {new Date(d.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </DashboardLayout>
    )
}
