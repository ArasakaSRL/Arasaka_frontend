import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import HabilidadesTecnicas from '@/features/portafolio/components/HabilidadesTecnicas';
import { PortfolioHeaderTracker } from '@/features/reportesUsuario/components/capturarInteracciones/PortfolioHeaderTracker';
import { HabilidadesBlandasTracker } from '@/features/reportesUsuario/components/capturarInteracciones/HabilidadesBlandasTracker';
import { ExperienciaTracker } from '@/features/reportesUsuario/components/capturarInteracciones/ExperienciaTracker';
import { ProyectosTracker } from '@/features/reportesUsuario/components/capturarInteracciones/ProyectosTracker';
import { CertificacionesTracker } from '@/features/reportesUsuario/components/capturarInteracciones/CertificacionesTracker';
import { useHabilidadesTecnicasTracker } from '@/features/portafolio/hooks/useHabilidadesTecnicasTracker';
import { useVisitor } from '@/features/portafolio/hooks/useVisitor';
import { CertificacionesSection } from '@/features/portafolio/components/CertificacionesSection';
import { NavbarVertical } from '@/features/portafolio/components/NavbarVertical';
import SeccionProyectos from '@/features/portafolio/components/SeccionProyectos';
import HabilidadesBlandas from '@/features/portafolio/components/HabilidadesBlandas';
import ExperienceTimeline from '@/features/portafolio/components/ExperienceTimeline';
import { getPortafolioPublic } from '@/features/portafolio/lib/portafolio.service';
import PortfolioHeader from '@/features/portafolio/components/PortfolioHeader ';
import type { habilidades, Usuario, experiencias, HabilidadBlanda, HabilidadTecnica, Proyectos, configuracion, certificaciones, formacion_academica, InformacionBasica } from '@/features/portafolio/types/portafolioType';
import { HabilidadesTecnicasTracker } from '@/features/reportesUsuario/components/capturarInteracciones/HabilidadesTecnicasTracker';

export default function Predeterminada() {
    const { slug } = useParams<{ slug: string }>();
    const { iniciarVisita } = useVisitor() 
    const { trackExpandir, trackCerrar }       = useHabilidadesTecnicasTracker(slug!)
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
    const [formacionAcademica, setFormacionAcademica] = useState<formacion_academica[]>([]);
    const [informacionBasica, setInformacionBasica] = useState<InformacionBasica | null>(null);
    useEffect(() => {
        const fetchPortfolioData = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setNoDisponible(false);
                iniciarVisita(slug)
                const data = await getPortafolioPublic(slug);
                setUsuario(data.usuario);
                setHabilidades(data.habilidades);
                setExperiencias(data.experiencias);
                setHabilidadesTecnicas(data.habilidades.tecnicas);
                setHabilidadesBlandas(data.habilidades.blandas);
                setProyectos(data.proyectos);
                setConfiguracion(data.configuracion);
                setCertificaciones(data.certificaciones);
                setFormacionAcademica(data.formacion_academica ?? []);
                setInformacionBasica(data.informacion_basica ?? null);

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
            <NavbarVertical config={configuracion} />
            <div className="max-w-350 mx-auto flex flex-col gap-6">
                <section id="inicio">
                    <PortfolioHeaderTracker portfolioSlug={slug!}>
                         <PortfolioHeader
                        usuario={usuario}
                        proyectos={configuracion?.mostrar_proyectos ? proyectos : []}
                        tecnicas={configuracion?.mostrar_habilidades ? habilidadesTecnicas : []}
                        blandas={configuracion?.mostrar_habilidades ? habilidadesBlandas : []}
                        experiencias={configuracion?.mostrar_experiencias ? experiencias : []}
                        certificaciones={configuracion?.mostrar_certificaciones ? certificaciones : []}
                        formacion_academica={formacionAcademica}
                        informacion_basica={informacionBasica}
                        mostrarCV={configuracion?.mostrar_cv ?? true}
                        mostrarContacto={configuracion?.mostrar_contacto ?? true}
                        mostrarRedes={configuracion?.mostrar_redes_profesionales ?? true}
                    />
                    </PortfolioHeaderTracker>
                </section>
            </div>
            {configuracion?.mostrar_habilidades && (
                <section id="habilidades">
                    <HabilidadesTecnicasTracker portfolioSlug={slug!}>
                        <HabilidadesTecnicas tecnicas={habilidadesTecnicas} onExpandir={trackExpandir} onCerrar={trackCerrar} />
                    </HabilidadesTecnicasTracker>
                    <HabilidadesBlandasTracker portfolioSlug={slug!}>
                        <HabilidadesBlandas blandas={habilidadesBlandas}/>
                    </HabilidadesBlandasTracker>
                </section>

            )}
            {configuracion?.mostrar_experiencias && (
                <section id="experiencia">
                    <ExperienciaTracker portfolioSlug={slug!}>
                        <ExperienceTimeline experiencias={experiencias} />
                    </ExperienciaTracker>
                </section>
            )}
            {configuracion?.mostrar_proyectos && (
                <section id="proyectos">
                    <ProyectosTracker portfolioSlug={slug!}>
                        <SeccionProyectos proyectos={proyectos} />
                    </ProyectosTracker>
                </section>
            )}
            {configuracion?.mostrar_certificaciones && (
                <section id="certificaciones">
                    <CertificacionesTracker portfolioSlug={slug!}>
                        <CertificacionesSection certificaciones={certificaciones} />
                    </CertificacionesTracker>
                </section>
            )}

        </div>
    );
}