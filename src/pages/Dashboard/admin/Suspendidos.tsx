import { useEffect, useState } from 'react'
import { ShieldOff, UserX, Mail, ExternalLink, Clock } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import DashboardLayout from '@/layout/DashboardLayout'
import { Banner } from '@/components/Banner'
import { getPortafoliosSuspendidos, getUsuariosSuspendidos } from '@/features/denuncias/api/adminDenunciaApi'
import type { PortafolioSuspendido, UsuarioSuspendido } from '@/features/denuncias/types/adminDenunciaType'

type Tab = 'portafolios' | 'usuarios'

function Avatar({ nombre, foto }: { nombre: string; foto: string | null }) {
    return foto ? (
        <img src={foto} alt={nombre} className="w-16 h-16 rounded-full object-cover" />
    ) : (
        <div className="w-16 h-16 rounded-full bg-[#16266B] text-white flex items-center justify-center text-xl font-bold">
            {nombre.split(' ').map(w => w[0]).slice(0, 2).join('')}
        </div>
    )
}

export default function AdminSuspendidos() {
    const [tab, setTab] = useState<Tab>('portafolios')
    const [portafolios, setPortafolios] = useState<PortafolioSuspendido[]>([])
    const [usuarios, setUsuarios]       = useState<UsuarioSuspendido[]>([])

    useEffect(() => {
        getPortafoliosSuspendidos().then(setPortafolios).catch(() => {})
        getUsuariosSuspendidos().then(setUsuarios).catch(() => {})
    }, [])

    return (
        <DashboardLayout>
            <Banner titulo="Suspendidos" descripcion="Portafolios y usuarios suspendidos automáticamente" />

            <div className="mt-6 flex gap-2">
                <button
                    onClick={() => setTab('portafolios')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                        ${tab === 'portafolios' ? 'bg-[#1e2a5e] text-white shadow' : 'bg-white text-slate-500 border border-gray-200 hover:bg-gray-50'}`}
                >
                    <ShieldOff size={15} /> Portafolios
                    {portafolios.length > 0 && <span className="ml-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{portafolios.length}</span>}
                </button>
                <button
                    onClick={() => setTab('usuarios')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                        ${tab === 'usuarios' ? 'bg-[#1e2a5e] text-white shadow' : 'bg-white text-slate-500 border border-gray-200 hover:bg-gray-50'}`}
                >
                    <UserX size={15} /> Usuarios
                    {usuarios.length > 0 && <span className="ml-1 bg-red-700 text-white text-xs px-1.5 py-0.5 rounded-full">{usuarios.length}</span>}
                </button>
            </div>

            <div className="mt-6">
                <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                        {tab === 'portafolios' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {portafolios.length === 0 && <p className="text-slate-400 text-sm col-span-3">No hay portafolios suspendidos.</p>}
                                {portafolios.map(p => (
                                    <article key={p.id_portafolio} className="bg-white rounded-2xl shadow-sm border border-red-100 hover:shadow-md transition-all flex flex-col overflow-hidden">
                                        <div className="bg-linear-to-br from-[#1e2a5e] to-[#16266B] px-5 pt-6 pb-10 flex flex-col items-center gap-2">
                                            <Avatar nombre={p.nombre} foto={p.usuario.url_foto} />
                                            <div className="text-center">
                                                <h3 className="font-bold text-white text-base">{p.nombre}</h3>
                                                <div className="flex items-center justify-center gap-1 text-blue-200 text-xs mt-0.5">
                                                    <Mail size={11} />
                                                    <span className="truncate max-w-40">{p.usuario.correo}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-5 pb-5 flex flex-col gap-3 -mt-5">
                                            <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
                                                <span className="text-gray-600 text-xs font-semibold">{p.usuario.nombre} {p.usuario.apellido}</span>
                                                <span className="text-gray-400 text-xs">@{p.usuario.username}</span>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Motivos</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {p.denuncias.map((d, i) => (
                                                        <span key={i} className="text-xs bg-slate-50 border border-slate-100 text-slate-500 font-medium px-2.5 py-1 rounded-full">{d.etiqueta.nombre}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <a href={`${window.location.origin}/portafolio/${p.slug}`} target="_blank" rel="noopener noreferrer"
                                                className="w-full py-2.5 px-4 bg-gray-50 hover:bg-[#1e2a5e] text-gray-500 hover:text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
                                                Ver Portafolio <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {tab === 'usuarios' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {usuarios.length === 0 && <p className="text-slate-400 text-sm col-span-3">No hay usuarios suspendidos.</p>}
                                {usuarios.map(u => (
                                    <article key={u.id_usuario} className="bg-white rounded-2xl shadow-sm border border-red-100 hover:shadow-md transition-all flex flex-col overflow-hidden">
                                        <div className="bg-linear-to-br from-[#1e2a5e] to-[#16266B] px-5 pt-6 pb-10 flex flex-col items-center gap-2">
                                            <Avatar nombre={u.nombre} foto={u.url_foto} />
                                            <div className="text-center">
                                                <h3 className="font-bold text-white text-base">{u.nombre} {u.apellido}</h3>
                                                <p className="text-blue-200 text-sm">@{u.username}</p>
                                            </div>
                                        </div>

                                        <div className="px-5 pb-5 flex flex-col gap-3 -mt-5">
                                            <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
                                                <Mail size={13} className="text-gray-400 shrink-0" />
                                                <span className="text-gray-500 text-xs truncate">{u.correo}</span>
                                            </div>

                                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-black tracking-wider text-red-400">Cuenta suspendida</p>
                                                    <p className="font-bold text-red-600 text-sm">{u.portafolios.length} portafolio{u.portafolios.length !== 1 ? 's' : ''} suspendido{u.portafolios.length !== 1 ? 's' : ''}</p>
                                                </div>
                                                {u.suspendido_hasta && (
                                                    <div className="flex flex-col items-end gap-0.5">
                                                        <Clock size={13} className="text-red-300" />
                                                        <span className="text-red-400 text-[10px] font-semibold">{new Date(u.suspendido_hasta).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Portafolios</p>
                                                {u.portafolios.map(p => (
                                                    <div key={p.id_portafolio} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1e2a5e] shrink-0" />
                                                        <span className="text-xs text-slate-600 font-medium truncate">{p.nombre}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </DashboardLayout>
    )
}
