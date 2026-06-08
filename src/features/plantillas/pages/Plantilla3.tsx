import { useAuthStore } from "@/stores/authStore";
import { usePortfolioData } from "@/features/reportesUsuario/hooks/usePortfolioData";

import PerfilBubble from "@/features/plantillas/components/plantilla 3/perfilPlantilla3";
import HabilidadesJam from "@/features/plantillas/components/plantilla 3/habilidadesPlantilla3";
import Experiencia from "@/features/plantillas/components/plantilla 3/experienciaPlantilla3";
import ProyectosPastel from "@/features/plantillas/components/plantilla 3/proyectosPlantilla3";
import CertificacionesPastel from "@/features/plantillas/components/plantilla 3/certificacionesPlantilla3";
export default function Plantilla3() {

  const slug = useAuthStore(
    (state) => state.portafolioSeleccionado?.slug
  );

  const { data, loading, noDisponible } =
    usePortfolioData(slug);

  if (!slug) {
    return <div>Portafolio no encontrado</div>;
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (noDisponible || !data) {
    return <div>Portafolio no disponible</div>;
  }

  const config = data.configuracion;
console.log("Configuración:", data.configuracion);
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">

      <PerfilBubble
        usuario={data.usuario}
        proyectos={ data.configuracion?.mostrar_proyectos ? data.proyectos : [] }
        tecnicas={ data.configuracion?.mostrar_habilidades ? data.habilidadesTecnicas : []}
        blandas={
          data.configuracion?.mostrar_habilidades
            ? data.habilidadesBlandas
            : []
        }
        experiencias={ data.configuracion?.mostrar_experiencias ? data.experiencias : [] }
        certificaciones={ data.configuracion?.mostrar_certificaciones ? data.certificaciones : [] }
        mostrarCV={ data.configuracion?.mostrar_cv ?? true }
        mostrarContacto={ data.configuracion?.mostrar_contacto ?? true }
        mostrarRedes={ data.configuracion?.mostrar_redes_profesionales ?? true }
      />

      {config?.mostrar_habilidades && (
        <HabilidadesJam
          tecnicas={data.habilidadesTecnicas}
          blandas={data.habilidadesBlandas}
        />
      )}

      {config?.mostrar_experiencias && (
        <Experiencia
          experiencias={data.experiencias}
        />
      )}

      {config?.mostrar_proyectos && (
        <ProyectosPastel
          proyectos={data.proyectos}
        />
      )}

      {config?.mostrar_certificaciones && (
        <CertificacionesPastel
          certificaciones={data.certificaciones}
        />
      )}
    </div>
  );
}