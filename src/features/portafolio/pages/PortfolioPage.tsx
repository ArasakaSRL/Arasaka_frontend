import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PortfolioHeader from '../components/PortfolioHeader ';
import { getPortafolioPublic } from '../lib/portafolio.service';
import type { Usuario, habilidades, experiencias, HabilidadTecnica, HabilidadBlanda, Proyectos, configuracion, certificaciones } from '../types/portafolioType';
import HabilidadesTecnicas from '@/features/portafolio/components/HabilidadesTecnicas';
import ExperienceTimeline from '../components/ExperienceTimeline';
import HabilidadesBlandas from '../components/HabilidadesBlandas';
import SeccionProyectos from '../components/SeccionProyectos';
import { NavbarVertical } from '../components/NavbarVertical';
import { CertificacionesSection } from '../components/CertificacionesSection';
export default function PortfolioPage() {
    const { slug } = useParams<{ slug: string }>();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [, setHabilidades] = useState<habilidades | null>(null);
    const [loading, setLoading] = useState(true);
    const [noDisponible, setNoDisponible] = useState(false);
    const [experiencias, setExperiencias] = useState<experiencias[]>([]);
    const [habilidadesTecnicas, setHabilidadesTecnicas] = useState<HabilidadTecnica[]>([]);
    const [habilidadesBlandas, setHabilidadesBlandas] = useState<HabilidadBlanda[]>([]);
    const [proyectos, setProyectos] = useState<Proyectos[]>([]);
    const [configuracion, setConfiguracion] = useState<configuracion | null>(null);
    const [certificaciones, setCertificaciones] = useState<certificaciones[]>([]);
    useEffect(() => {
        const fetchPortfolioData = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setNoDisponible(false);
                const data = await getPortafolioPublic(slug);
                setUsuario(data.usuario);
                setHabilidades(data.habilidades);
                setExperiencias(data.experiencias);
                setHabilidadesTecnicas(data.habilidades.tecnicas);
                setHabilidadesBlandas(data.habilidades.blandas);
                setProyectos(data.proyectos);
                setConfiguracion(data.configuracion);
                setCertificaciones(data.certificaciones);

            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setNoDisponible(true);
                }
                console.error("Error fetching portfolio:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white">Cargando...</div>;
    }

    if (noDisponible || !usuario) {
        return (
            <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">Este portafolio ya no está disponible</h1>
                    <p className="text-slate-300 text-sm">El enlace puede haber expirado o haber sido desactivado.</p>
                </div>
            </div>
        );
    }
    return (

        <div className="p-3 w-full min-h-screen ">
            <NavbarVertical />
            <div className="max-w-350 mx-auto flex flex-col gap-6">
                <section id="inicio">
                    <PortfolioHeader usuario={usuario} />
                </section>
            </div>
            {configuracion?.mostrar_habilidades && (
                <section id="habilidades">
                    <HabilidadesTecnicas tecnicas={habilidadesTecnicas} />
                    <HabilidadesBlandas blandas={habilidadesBlandas} />
                </section>

            )}
            {configuracion?.mostrar_experiencias && (
                <section id="experiencia">
                    <ExperienceTimeline experiencias={experiencias} />
                </section>
            )}
            {configuracion?.mostrar_proyectos && (
                <section id="proyectos">
                    <SeccionProyectos proyectos={proyectos} />
                </section>
            )}
            {configuracion?.mostrar_certificaciones && (
                <section id="certificaciones">
                    <CertificacionesSection certificaciones={certificaciones} />
                </section>
            )}

        </div>
    );
}