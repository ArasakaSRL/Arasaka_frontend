import { BriefcaseBusiness } from 'lucide-react';
import type { Profesion } from '@/features/auth/types/update-perfilPersonal';

interface PerfilPreviewProps {
    user: {
        nombre: string;
        apellido: string;
        url_foto?: string | null;
    };
    formData: {
        nombre: string;
        apellido: string;
        descripcion_laboral: string;
        correo: string;
    };
    profesiones: Profesion[];
}

export default function PerfilPreview({
    user,
    formData,
    profesiones
}: PerfilPreviewProps) {

    const iniciales =
        `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`
            .toUpperCase();

    return (
        <div className="lg:col-span-5 space-y-4!">
                    <p className="text-xl text-left font-bold text-slate-500!">Vista previa en tiempo real</p>

                    <div className="bg-[#1e2a5e] rounded-2xl p-4 shadow-2xl min-h-125 flex flex-col gap-4">
                        <div className="bg-linear-to-br from-slate-400 to-slate-200 rounded-2xl p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-2xl font-bold mb-3 border-4 border-white/30">
                                {user.url_foto
                                    ? <img src={user.url_foto} alt={user.nombre} className="w-full h-full object-cover rounded-full" />
                                    : iniciales
                                }
                            </div>
                            <h3 className="text-xl font-bold text-black">{formData.nombre} {formData.apellido}</h3>
                            {profesiones.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 justify-center mb-2">
                                    {profesiones.map(p => (
                                        <span key={p.id_profesion} className="px-3 py-1 bg-[#1e2a5e] text-white text-xs rounded-full">
                                            {p.nombre}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-slate-800! text-sm">{formData.correo}</p>
                        </div>

                        <div className="bg-white rounded-2xl flex-1 p-8 flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-2 rounded-2xl mb-2">
                                <BriefcaseBusiness className="text-black" size={90} strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-semibold text-black mb-2">Tu portafolio está vacío</h4>
                            <p className="text-gray-700! text-sm px-2">
                                Comienza agregando información en las secciones del menú lateral. Los cambios se reflejarán aquí en tiempo real.
                            </p>
                        </div>
                    </div>
                </div>
    );
}