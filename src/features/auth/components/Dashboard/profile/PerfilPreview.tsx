import { BriefcaseBusiness, Briefcase, Award, Wrench, BookOpen } from 'lucide-react';
import type { Profesion } from '@/features/auth/types/update-perfilPersonal';
import type { PortafolioCompleto } from '@/features/auth/types/portafolioData';

interface PerfilPreviewProps {
    user: {
        nombre: string;
        apellido: string;
        url_foto?: string | null;
        portafolio?: { nombre: string } | null;
    };
    formData: {
        nombre: string;
        apellido: string;
        biografia: string;
        correo: string;
    };
    profesiones: Profesion[];
    portafolio: PortafolioCompleto | null;
    loadingPortafolio: boolean;
}

function SeccionPreview({ icon: Icon, titulo, children }: {
    icon: React.ElementType;
    titulo: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
                <Icon size={14} className="text-[#1e2a5e]" />
                <h4 className="text-sm font-bold text-[#1e2a5e]">{titulo}</h4>
            </div>
            {children}
        </div>
    )
}

export default function PerfilPreview({
    user, formData, profesiones, portafolio, loadingPortafolio
}: PerfilPreviewProps) {

    const iniciales = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()

    const tieneContenido = portafolio && Object.keys(portafolio).length > 0 && (
        (portafolio.proyectos?.length > 0) ||
        (portafolio.habilidades?.length > 0) ||
        (portafolio.experiencias?.length > 0) ||
        (portafolio.servicios?.length > 0)
    )

    return (
        <div className="lg:col-span-5 space-y-4!">
            <p className="text-xl text-left font-bold text-slate-500!">Vista previa en tiempo real</p>

            <div className="bg-[#1e2a5e] rounded-2xl p-4 shadow-2xl flex flex-col gap-4">

                <div className="bg-linear-to-br from-slate-300 to-slate-100 rounded-2xl p-6 text-center flex flex-col items-center gap-2">
                    <div className="w-20 h-20 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-2xl font-bold border-4 border-white/50 overflow-hidden">
                        {user.url_foto
                            ? <img src={user.url_foto} alt={user.nombre} className="w-full h-full object-cover" />
                            : iniciales
                        }
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{formData.nombre} {formData.apellido}</h3>
                        <p className="text-slate-500 text-xs">{formData.correo}</p>
                    </div>
                    {profesiones.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                            {profesiones.map(p => (
                                <span key={p.id_profesion} className="px-2.5 py-0.5 bg-[#1e2a5e] text-white text-[11px] rounded-full">
                                    {p.nombre}
                                </span>
                            ))}
                        </div>
                    )}
                    {formData.biografia && (
                        <p className="text-slate-600 text-xs text-center line-clamp-2 px-2">{formData.biografia}</p>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">

                    {(portafolio?.nombre) && (
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="text-base">📁</span>
                            <h3 className="text-sm font-bold text-[#1e2a5e]">{portafolio?.nombre ?? user.portafolio?.nombre}</h3>
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
                        <>                            {portafolio?.experiencias?.length > 0 && (
                            <SeccionPreview icon={BookOpen} titulo="Experiencia">
                                {portafolio.experiencias.slice(0, 2).map(exp => (
                                    <div key={exp.id_experiencia} className="flex flex-col gap-0.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-800">{exp.cargo}</p>
                                        <p className="text-[11px] text-slate-500">{exp.nombre_organizacion}</p>
                                        <p className="text-[11px] text-slate-400">
                                            {exp.fecha_inicio} — {exp.vigente ? 'Presente' : exp.fecha_fin ?? ''}
                                        </p>
                                    </div>
                                ))}
                            </SeccionPreview>
                        )}

                            {portafolio?.habilidades?.length > 0 && (
                                <SeccionPreview icon={Award} titulo="Habilidades">
                                    <div className="flex flex-wrap gap-1.5">
                                        {portafolio.habilidades.slice(0, 6).map(hab => (
                                            <span key={hab.id_habilidad} className="px-2.5 py-1 bg-blue-50 text-[#1e2a5e] text-[11px] font-medium rounded-full border border-blue-100">
                                                {hab.nombre}
                                            </span>
                                        ))}
                                        {portafolio.habilidades.length > 6 && (
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[11px] rounded-full">
                                                +{portafolio.habilidades.length - 6} más
                                            </span>
                                        )}
                                    </div>
                                </SeccionPreview>
                            )}

                            {portafolio?.proyectos?.length > 0 && (
                                <SeccionPreview icon={Briefcase} titulo="Proyectos">
                                    {portafolio.proyectos.slice(0, 2).map(proy => (
                                        <div key={proy.id_proyecto} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs font-semibold text-slate-800">{proy.nombre}</p>
                                            {proy.descripcion && (
                                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{proy.descripcion}</p>
                                            )}
                                        </div>
                                    ))}
                                </SeccionPreview>
                            )}

                            {portafolio?.servicios?.length > 0 && (
                                <SeccionPreview icon={Wrench} titulo="Servicios">
                                    {portafolio.servicios.slice(0, 2).map(srv => (
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
            </div>
        </div>
    )
}
