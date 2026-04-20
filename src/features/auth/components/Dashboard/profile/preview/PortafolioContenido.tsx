import { BriefcaseBusiness, Briefcase, Award, Wrench, BookOpen, GitBranch, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PortafolioCompleto } from '@/features/auth/types/portafolioData';
import SeccionPreview from './SeccionPreview';
import HabilidadesGrid from './HabilidadesGrid';

interface Props {
    portafolio: PortafolioCompleto | null;
    loadingPortafolio: boolean;
}

const formatFecha = (fecha?: string | null) => {
    if (!fecha) return '';
    return new Intl.DateTimeFormat('es-BO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(fecha));
};

export default function PortafolioContenido({ portafolio, loadingPortafolio }: Props) {
    const tieneContenido = portafolio && Object.keys(portafolio).length > 0 && (
        (portafolio.proyectos?.length > 0) ||
        (portafolio.habilidades?.length > 0) ||
        (portafolio.experiencias?.length > 0) ||
        (portafolio.servicios?.length > 0)
    )

    return (
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
            {portafolio?.nombre && (
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <span className="text-base">📁</span>
                    <h3 className="text-sm font-bold text-[#1e2a5e]">{portafolio.nombre}</h3>
                </div>
            )}

            {loadingPortafolio ? (
                <div className="flex items-center justify-center py-8">
                    <p className="text-gray-400 text-sm animate-pulse">Cargando portafolio...</p>
                </div>
            ) : !tieneContenido ? (
                <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
                    <BriefcaseBusiness className="text-gray-300" size={64} strokeWidth={1.2} />
                    <h4 className="text-base font-semibold text-gray-700">Tu portafolio está vacío</h4>
                    <p className="text-gray-400 text-xs px-4">
                        Agrega experiencias, habilidades y servicios para verlos aquí.
                    </p>
                </div>
            ) : (
                <>
                    {portafolio?.habilidades?.length > 0 && (
                        <SeccionPreview icon={Award} titulo="Habilidades">
                            <HabilidadesGrid habilidades={portafolio.habilidades} />
                        </SeccionPreview>
                    )}

                    {portafolio?.experiencias?.length > 0 && (
                        <SeccionPreview icon={BookOpen} titulo="Experiencia" collapsible>
                            {portafolio.experiencias.map((exp, i) => (
                                <motion.div
                                    key={exp.id_experiencia}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.07 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="flex gap-3 p-3 rounded-xl border border-[#1e2a5e]/10 bg-linear-to-r from-[#1e2a5e]/5 to-white shadow-sm cursor-default"
                                >
                                    <div className="w-1 rounded-full bg-linear-to-b from-[#1e2a5e] to-[#3b4f9e] shrink-0" />
                                    <div className="flex flex-col gap-1 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-[14px] text-left font-bold text-slate-900 leading-tight">{exp.cargo}</p>
                                                <p className="text-[13px] text-[#1e2a5e] font-semibold mt-0.5">{exp.nombre_organizacion}</p>
                                            </div>
                                            {exp.vigente && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200"
                                                >
                                                    Actual
                                                </motion.span>
                                            )}
                                        </div>
                                        {exp.descripcion && (
                                            <p className="text-[12px] text-slate-500 line-clamp-7 leading-relaxed">{exp.descripcion}</p>
                                        )}
                                        <p className="text-[12px] text-blue-800 font-medium">
                                            {formatFecha(exp.fecha_inicio)} — {exp.vigente ? 'Presente' : formatFecha(exp.fecha_fin)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </SeccionPreview>
                    )}

                    {portafolio?.proyectos?.length > 0 && (
                        <SeccionPreview icon={Briefcase} titulo="Proyectos" collapsible>
                            {portafolio.proyectos.map((proy, i) => (
                                <motion.div
                                    key={proy.id_proyecto}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.07 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="flex gap-3 p-3 rounded-xl border border-[#1e2a5e]/10 bg-linear-to-r from-[#1e2a5e]/5 to-white shadow-sm cursor-default"
                                >
                                    <div className="w-1 rounded-full bg-linear-to-b from-[#1e2a5e] to-[#3b4f9e] shrink-0" />
                                    <div className="flex flex-col gap-1 flex-1">
                                        <p className="text-[14px] font-bold text-slate-900 leading-tight">{proy.nombre}</p>
                                        {proy.descripcion && (
                                            <p className="text-[12px] text-slate-500 line-clamp-4 leading-relaxed">{proy.descripcion}</p>
                                        )}
                                        <div className="flex flex-wrap justify-center gap-4! mt-0.5">
                                            {proy.url_demo && (
                                                <a href={proy.url_demo} target="_blank" rel="noreferrer"
                                                    className="inline-flex gap-1 text-[13px] text-[#1e2a5e] font-semibold hover:underline">
                                                    <Globe size={15} className="inline text-black" /> 
                                                    Demo
                                                </a>
                                            )}
                                            {proy.url_github && (
                                                <a href={proy.url_github} target="_blank" rel="noreferrer"
                                                    className="inline-flex gap-1 text-[13px] text-slate-600 font-semibold hover:underline">
                                                    <GitBranch size={15} className="inline text-black" /> 
                                                    GitHub
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-[12px] text-blue-800 font-medium">
                                            {formatFecha(proy.fecha_inicio)} — {proy.fecha_fin ? formatFecha(proy.fecha_fin) : 'Presente'}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </SeccionPreview>
                    )}

                    {portafolio?.servicios?.length > 0 && (
                        <SeccionPreview icon={Wrench} titulo="Servicios" collapsible>
                            {portafolio.servicios.map(srv => (
                                <div key={srv.id_servicio} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-800">{srv.nombre}</p>
                                    {srv.descripcion && (
                                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{srv.descripcion}</p>
                                    )}
                                </div>
                            ))}
                        </SeccionPreview>
                    )}
                </>
            )}
        </div>
    )
}
