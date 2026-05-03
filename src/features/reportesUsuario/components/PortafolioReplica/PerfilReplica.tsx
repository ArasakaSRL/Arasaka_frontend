import { useAuthStore } from '@/stores/authStore';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import PortfolioHeader from '@/features/portafolio/components/PortfolioHeader ';
import HabilidadesTecnicas from '@/features/portafolio/components/HabilidadesTecnicas';
import HabilidadesBlandas from '@/features/portafolio/components/HabilidadesBlandas';
import ExperienceTimeline from '@/features/portafolio/components/ExperienceTimeline';
import SeccionProyectos from '@/features/portafolio/components/SeccionProyectos';
import { CertificacionesSection } from '@/features/portafolio/components/CertificacionesSection';
import { HeatmapSeccion } from '../heatmap/HeatmapSeccion';

interface Intensidades {
  perfil: number
  // más adelante: habilidades, experiencia, proyectos, certificaciones
}

interface PerfilReplicaProps {
  intensidades: Intensidades
}


export function PerfilReplica({ intensidades }: PerfilReplicaProps) {
  const slug = useAuthStore((state) => state.user?.portafolio?.slug);
  const { data, loading, noDisponible } = usePortfolioData(slug);

  if (!slug)        return <div>No tienes un portafolio asignado.</div>;
  if (loading)      return <div>Cargando...</div>;
  if (noDisponible || !data) return <div>Portafolio no disponible.</div>;

  const { usuario, habilidadesTecnicas, habilidadesBlandas, experiencias, proyectos, configuracion, certificaciones } = data;

  return (
    <>
        <HeatmapSeccion intensidad={intensidades.perfil}>
          <PortfolioHeader usuario={usuario} />
        </HeatmapSeccion>

      {configuracion?.mostrar_habilidades && (
        <>
          <HeatmapSeccion intensidad={0}>
            <HabilidadesTecnicas tecnicas={habilidadesTecnicas} onExpandir={() => {}} onCerrar={() => {}} />
          </HeatmapSeccion>

          <HeatmapSeccion intensidad={0}>
            <HabilidadesBlandas blandas={habilidadesBlandas} />
          </HeatmapSeccion>
        </>
      )}

      {configuracion?.mostrar_experiencias && (
        <HeatmapSeccion>
            <ExperienceTimeline experiencias={experiencias} />
        </HeatmapSeccion>
        
      )}

      {configuracion?.mostrar_proyectos && (
        <HeatmapSeccion>
            <SeccionProyectos proyectos={proyectos} />
        </HeatmapSeccion>
        
      )}

      {configuracion?.mostrar_certificaciones && (
        <HeatmapSeccion>
            <CertificacionesSection certificaciones={certificaciones} />
        </HeatmapSeccion>
      )}
    </>
  );
}