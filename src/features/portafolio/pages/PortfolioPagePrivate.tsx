import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPortafolioPrivate } from '../lib/portafolio.service';
import type { configuracion } from '../types/portafolioType';
import Predeterminada from '@/features/plantillas/pages/Predeterminada';
import Plantilla1 from '@/features/plantillas/pages/Plantilla1';
import Plantilla2 from '@/features/plantillas/pages/Plantilla2';
import Plantilla3 from '@/features/plantillas/pages/Plantilla3';

export default function PortfolioPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [configuracion, setConfiguracion] = useState<configuracion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const data = await getPortafolioPrivate(slug);
                setConfiguracion(data.configuracion);
            } catch (err) {
                console.error("Error fetching portfolio:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white">Cargando...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white">No se pudo cargar el portafolio</div>;
    }

    const renderPlantilla = () => {
        switch (configuracion?.plantilla ?? "predeterminado") {
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
    };

    return (
        <div className="relative">
            <button
                onClick={() => navigate('/Dashboard/perfil/General')}
                className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/80"
            >
                <ArrowLeft size={16} />
                Volver al dashboard
            </button>
            {renderPlantilla()}
        </div>
    );
}
