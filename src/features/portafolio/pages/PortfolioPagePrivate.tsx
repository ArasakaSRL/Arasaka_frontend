import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PortfolioHeader from '../components/PortfolioHeader '; 
import { getPortafolioPrivate } from '../lib/portafolio.service';
import type { Usuario ,habilidades,experiencias,HabilidadTecnica,HabilidadBlanda,Proyectos ,configuracion,certificaciones} from '../types/portafolioType';
import HabilidadesTecnicas from '@/features/portafolio/components/HabilidadesTecnicas';
import ExperienceTimeline from '../components/ExperienceTimeline';
import HabilidadesBlandas from '../components/HabilidadesBlandas';
import SeccionProyectos from '../components/SeccionProyectos';
import { NavbarVertical } from '../components/NavbarVertical';
import { CertificacionesSection } from '../components/CertificacionesSection';
import { set } from 'zod';

export default function PortfolioPage() {
    const { slug } = useParams<{ slug: string }>();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [habilidades, setHabilidades] = useState<habilidades | null>(null);
    const [loading, setLoading] = useState(true);
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
                const data = await getPortafolioPrivate(slug);
                console.log("Datos del portafolio:", data);
                setUsuario(data.usuario);
                setHabilidades(data.habilidades);
                setExperiencias(data.experiencias);
                setHabilidadesTecnicas(data.habilidades.tecnicas);
                setHabilidadesBlandas(data.habilidades.blandas);
                setProyectos(data.proyectos);
                setConfiguracion(data.configuracion);
                setCertificaciones(data.certificaciones);               
            } catch (error) {
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

    if (!usuario) {
        return <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white">No se encontró el usuario</div>;
    }

    return (
             
        <div className="p-3 w-full min-h-screen ">
                <NavbarVertical /> 
            <div className="max-w-350 mx-auto flex flex-col gap-6">
                <section id="inicio">
                    <PortfolioHeader
                        usuario={usuario}
                        proyectos={configuracion?.mostrar_proyectos ? proyectos : []}
                        tecnicas={configuracion?.mostrar_habilidades ? habilidadesTecnicas : []}
                        blandas={configuracion?.mostrar_habilidades ? habilidadesBlandas : []}
                        experiencias={configuracion?.mostrar_experiencias ? experiencias : []}
                        certificaciones={configuracion?.mostrar_certificaciones ? certificaciones : []}
                        mostrarCV={configuracion?.mostrar_cv ?? true}
                        mostrarContacto={configuracion?.mostrar_contacto ?? true}
                        mostrarRedes={configuracion?.mostrar_redes_profesionales ?? true}
                    />
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