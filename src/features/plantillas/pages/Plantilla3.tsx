import { usePortfolioData } from "@/features/reportesUsuario/hooks/usePortfolioData";
import { useParams } from "react-router-dom";
import PerfilBubble from "@/features/plantillas/components/plantilla 3/perfilPlantilla3";
import HabilidadesJam from "@/features/plantillas/components/plantilla 3/habilidadesPlantilla3";
import Experiencia from "@/features/plantillas/components/plantilla 3/experienciaPlantilla3";
import ProyectosPastel from "@/features/plantillas/components/plantilla 3/proyectosPlantilla3";
import CertificacionesPastel from "@/features/plantillas/components/plantilla 3/certificacionesPlantilla3";
export default function Plantilla3() {

  const {slug} = useParams<{ slug:string}>();

  const { data, loading, noDisponible } =
    usePortfolioData(slug);

  if (!slug)        return <div className="min-h-screen bg-[#F0EAD6] flex items-center justify-center text-black">URL inválida o portafolio no encontrado.</div>;
  if (loading)      return <div className="min-h-screen bg-[#F0EAD6] flex items-center justify-center text-black">Cargando portafolio...</div>;
  if (noDisponible || !data) return <div className="min-h-screen bg-[#F0EAD6] flex items-center justify-center text-black">Este portafolio no está disponible.</div>;

  const config = data.configuracion;
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
        formacion_academica={ data.formacion_academica }
        informacion_basica={ data.informacion_basica }
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