import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPortafolioPublic } from "@/features/portafolio/lib/portafolio.service";

import PageVistaProyecto from "../pages/PageVistaProyecto";
// import PageVistaProyectoPlantilla1 from "./PageVistaProyectoPlantilla1";
// import PageVistaProyectoPlantilla2 from "./PageVistaProyectoPlantilla2";
import PageVistaProyectoPlantilla3 from "../pages/PageVistaProyectoPlantilla3";

export default function ProyectoRouter() {
  const { slug } = useParams<{ slug: string }>();

  const [plantilla, setPlantilla] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarConfiguracion = async () => {
      if (!slug) return;

      try {
        const data = await getPortafolioPublic(slug);

        setPlantilla(
          data.configuracion?.plantilla || "predeterminado"
        );
      } catch (error) {
        console.error(error);
        setPlantilla("predeterminado");
      } finally {
        setLoading(false);
      }
    };

    cargarConfiguracion();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
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