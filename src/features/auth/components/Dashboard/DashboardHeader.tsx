import { useState } from 'react';
import { Share2, Eye, Menu, X, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import ShareModal from '@/features/portafolio/components/ShareModal';
import { generateCV } from '@/features/portafolio/lib/cv.generator';
import { getPortafolioPrivate } from '@/features/portafolio/lib/portafolio.service';
import { toast } from '@/components/Alerta';

interface DashboardHeaderProps {
    onMenuClick: () => void
    sidebarOpen: boolean
}

export default function DashboardHeader({ onMenuClick, sidebarOpen }: DashboardHeaderProps) {
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user)
    const portafolioSeleccionado = useAuthStore(s => s.portafolioSeleccionado)
    const [shareOpen, setShareOpen] = useState(false);
    const [descargandoCV, setDescargandoCV] = useState(false);

    const initials = user
        ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
        : '?'

    const handlevistapreviaPrivate = () => {
        navigate(`/portafolio/privado/${portafolioSeleccionado?.slug}`);
    }

    const handleDescargarCV = async () => {
        if (descargandoCV || !portafolioSeleccionado?.slug) return;
        setDescargandoCV(true);
        try {
            const portafolio = await getPortafolioPrivate(portafolioSeleccionado.slug);
            const infoBasica = portafolioSeleccionado.informacion_basica;
            const config = portafolio.configuracion;

            await generateCV({
                usuario: {
                    ...portafolio.usuario,
                    nombre: infoBasica?.nombre_completo?.split(' ')[0] ?? portafolio.usuario.nombre,
                    apellido: infoBasica?.nombre_completo?.split(' ').slice(1).join(' ') ?? portafolio.usuario.apellido,
                    correo: infoBasica?.gmail ?? portafolio.usuario.correo,
                    foto_perfil: infoBasica?.foto_perfil ?? portafolio.usuario.foto_perfil,
                    pais: infoBasica?.pais ?? portafolio.usuario.pais,
                },
                proyectos: config.mostrar_proyectos ? portafolio.proyectos : [],
                tecnicas: config.mostrar_habilidades ? portafolio.habilidades.tecnicas : [],
                blandas: config.mostrar_habilidades ? portafolio.habilidades.blandas : [],
                experiencias: config.mostrar_experiencias ? portafolio.experiencias : [],
                certificaciones: config.mostrar_certificaciones ? portafolio.certificaciones : [],
            });
            toast.success("pdf generado con éxito");
        } catch (err) {
            console.error("Error generando CV:", err);
            toast.error("Ocurrió un error al generar el pdf");
        } finally {
            setDescargandoCV(false);
        }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-6 transition-all duration-300">

            <div className="flex items-center ">
                <button
                    className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    onClick={onMenuClick}
                    aria-label="Toggle menú"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <img
                        src="https://res.cloudinary.com/dcyx3nqj5/image/upload/v1775541507/WhatsApp_Image_2026-04-07_at_1.53.52_AM-removebg-preview_dxvzgv.png"
                        alt="Arasaka logo"
                        className="h-18 w-auto object-contain"
                    />
                </div>
            </div>


            <div className="flex items-center gap-2 md:gap-3">
                <button
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 font-medium hover:bg-slate-300 rounded-lg transition-colors border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setShareOpen(true)}
                    disabled={!portafolioSeleccionado?.slug}
                >
                    <Share2 size={16} />
                    <span className="hidden sm:inline">Compartir</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-2 text-slate-600 font-medium hover:bg-slate-300 rounded-lg transition-colors border border-gray-200 text-sm"
                    onClick={handlevistapreviaPrivate}>
                    <Eye size={16} />
                    <span className="hidden sm:inline">Vista Previa</span>
                </button>

                <button
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 font-medium hover:bg-slate-300 rounded-lg transition-colors border border-gray-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleDescargarCV}
                    disabled={descargandoCV}
                >
                    <ExternalLink size={16} />
                    <span className="hidden sm:inline">{descargandoCV ? 'Generando...' : 'Descargar CV'}</span>
                </button>

                <div
                    onClick={() => navigate('/Dashboard/cuenta/Cuenta')}
                    className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm shadow-sm bg-[#1e2a5e] text-white cursor-pointer hover:ring-2 hover:ring-[#1e2a5e]/40 transition-all"
                >
                    {user?.url_foto
                        ? <img src={user.url_foto} alt={user.nombre} className="w-full h-full object-cover" />
                        : initials
                    }
                </div>
            </div>

            <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} portafolioSlug={portafolioSeleccionado?.slug ?? ''} />
        </header>
    );
}
