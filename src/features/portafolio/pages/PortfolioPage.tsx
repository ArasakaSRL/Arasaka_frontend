import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PortfolioHeader from '../components/PortfolioHeader '; 
import { getPortafolio } from '../lib/portafolio.service';
import type { Usuario ,habilidades,experiencias,HabilidadTecnica,HabilidadBlanda} from '../types/portafolioType';
import HabilidadesTecnicas from '@/features/portafolio/components/HabilidadesTecnicas';
import ExperienceTimeline from '../components/ExperienceTimeline';
import HabilidadesBlandas from '../components/HabilidadesBlandas';
export default function PortfolioPage() {
    const { slug } = useParams<{ slug: string }>();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [habilidades, setHabilidades] = useState<habilidades | null>(null);
    const [loading, setLoading] = useState(true);
    const [experiencias, setExperiencias] = useState<experiencias[]>([]);
    const [habilidadesTecnicas, setHabilidadesTecnicas] = useState<HabilidadTecnica[]>([]);
    const [habilidadesBlandas, setHabilidadesBlandas] = useState<HabilidadBlanda[]>([]);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            if (!slug) return;
            
            try {
                setLoading(true);
                const data = await getPortafolio(slug);
                console.log("Datos del portafolio:", data);
                setUsuario(data.usuario);
                setHabilidades(data.habilidades);
                setExperiencias(data.experiencias);
                setHabilidadesTecnicas(data.habilidades.tecnicas);
                setHabilidadesBlandas(data.habilidades.blandas);
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
            <div className="max-w-350 mx-auto flex flex-col gap-6">
                <PortfolioHeader usuario={usuario} />
            </div>
             <HabilidadesTecnicas tecnicas={habilidadesTecnicas} />
             <HabilidadesBlandas blandas={habilidadesBlandas} />
             <ExperienceTimeline experiencias={experiencias} />
            
           
           
        </div>
    );
}