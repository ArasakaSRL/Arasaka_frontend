import { useAuthStore } from "@/stores/authStore";
import { usePortfolioData } from "@/features/reportesUsuario/hooks/usePortfolioData";

import PerfilBubble from "@/features/plantillas/components/plantilla 3/perfilPlantilla3";
import HabilidadesJam from "@/features/plantillas/components/plantilla 3/habilidadesPlantilla3";
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">

      <PerfilBubble
        usuario={data.usuario}
      />

      <HabilidadesJam
        tecnicas={data.habilidadesTecnicas}
        blandas={data.habilidadesBlandas}
      />
    </div>
  );
}