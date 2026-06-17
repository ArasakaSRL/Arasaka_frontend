import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPortafolioPublic } from "@/features/portafolio/lib/portafolio.service";
import { obtenerProyectoPorId } from "../lib/VistaProyectoApi";

import PageVistaProyecto from "../pages/PageVistaProyecto";
// import PageVistaProyectoPlantilla1 from "./PageVistaProyectoPlantilla1";
// import PageVistaProyectoPlantilla2 from "./PageVistaProyectoPlantilla2";
import PageVistaProyectoPlantilla3 from "../pages/PageVistaProyectoPlantilla3";

export default function ProyectoRouter() {
  const { slug, id } = useParams<{ slug: string, id: string }>();

  const [plantilla, setPlantilla] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorProyecto, setErrorProyecto] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!slug || !id) return;
      try {
        const [portafolio] = await Promise.all([
          getPortafolioPublic(slug),
          obtenerProyectoPorId(id),
        ]);
        setPlantilla(
          portafolio.configuracion?.plantilla ??
          "predeterminado"
        );
      } catch (error) {
        console.error(error);
        setErrorProyecto(true);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

  }, [slug, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (errorProyecto) {
    return (
      <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">
            Proyecto no disponible
          </h1>

          <p className="text-slate-300 text-sm">
            El enlace puede haber expirado o es incorrecto.
          </p>
        </div>
      </div>
    );
  }

  

  switch (plantilla) {
    // case "minimalista":
    //   return <PageVistaProyectoPlantilla1 />;

    // case "profesional":
    //   return <PageVistaProyectoPlantilla2 />;

    case "stiloPastel":
      return <PageVistaProyectoPlantilla3 />;

    default:
      return <PageVistaProyecto />;
  }
}