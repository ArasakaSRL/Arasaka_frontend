import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPortafolioPublic } from '@/features/portafolio/lib/portafolio.service';

// Importa tus 4 plantillas (ajusta las rutas según la estructura de tus carpetas)
import Predeterminada from '@/features/plantillas/pages/Predeterminada'; 
import Plantilla1 from '@/features/plantillas/pages/Plantilla1';
import Plantilla2 from '@/features/plantillas/pages/Plantilla2';
import Plantilla3 from '@/features/plantillas/pages/Plantilla3';

export default function PortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const [plantilla, setPlantilla] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchConfiguracion = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        // Llamamos a tu servicio público que ya trae los datos del portafolio,
        // incluyendo la configuración.
        const data = await getPortafolioPublic(slug);
        // Si no hay plantilla definida, usamos la predeterminada
        setPlantilla(data.configuracion?.plantilla || 'predeterminado');
      } catch (err) {
        console.error("Error al cargar la configuración del portafolio:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguracion();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white">
        Cargando portafolio...
      </div>
    );
  }

  if (error || !plantilla) {
    return (
      <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Portafolio no disponible</h1>
          <p className="text-slate-300 text-sm">El enlace puede haber expirado o es incorrecto.</p>
        </div>
      </div>
    );
  }

  // Renderizador Dinámico basado en el valor guardado en la BD
  switch (plantilla) {
    case 'minimalista':
      return <Plantilla1 />;
    
    case 'profesional':
      return <Plantilla2 />;
    
    case 'stiloPastel':
      return <Plantilla3 />;
    
    case 'predeterminado':
    default:
      return <Predeterminada />;
  }
}