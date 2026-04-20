import type { Profesion } from '@/features/auth/types/update-perfilPersonal';
import type { PortafolioCompleto } from '@/features/auth/types/portafolioData';
import AvatarPerfil from './preview/AvatarPerfil';
import PortafolioContenido from './preview/PortafolioContenido';

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

export default function PerfilPreview({ user, formData, profesiones, portafolio, loadingPortafolio }: PerfilPreviewProps) {
    return (
        <div className="lg:col-span-5 space-y-4!">
            <p className="text-xl text-left font-bold text-slate-500!">Vista previa en tiempo real</p>

            <div className="bg-[#1e2a5e] rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
                <AvatarPerfil
                    user={user}
                    formData={formData}
                    profesiones={profesiones}
                />
                <PortafolioContenido
                    portafolio={portafolio}
                    loadingPortafolio={loadingPortafolio}
                />
            </div>
        </div>
    )
}
