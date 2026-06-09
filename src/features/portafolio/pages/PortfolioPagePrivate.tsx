import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import PortfolioHeader from '../components/PortfolioHeader '; 
import { getPortafolioPrivate } from '../lib/portafolio.service';
import type { Usuario ,habilidades,experiencias,HabilidadTecnica,HabilidadBlanda,Proyectos ,configuracion,certificaciones} from '../types/portafolioType';
// import HabilidadesTecnicas from '@/features/portafolio/components/HabilidadesTecnicas';
// import ExperienceTimeline from '../components/ExperienceTimeline';
// import HabilidadesBlandas from '../components/HabilidadesBlandas';
// import SeccionProyectos from '../components/SeccionProyectos';
// import { NavbarVertical } from '../components/NavbarVertical';
// import { CertificacionesSection } from '../components/CertificacionesSection';
import Predeterminada from '@/features/plantillas/pages/Predeterminada';
import Plantilla1 from '@/features/plantillas/pages/Plantilla1';
import Plantilla2 from '@/features/plantillas/pages/Plantilla2';
import Plantilla3 from '@/features/plantillas/pages/Plantilla3';

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

    const plantilla = configuracion?.plantilla ?? "predeterminado";

    switch (plantilla) {
    case "minimalista":
        return <Plantilla1 />;

    case "profesional":
        return <Plantilla2 />;

    case "stiloPastel":
        return <Plantilla3 />;

    case "predeterminado":
    default:
        return <Predeterminada />;
    }
}