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
  tecnicas: number
  // más adelante: habilidades, experiencia, proyectos, certificaciones
}

interface PerfilReplicaProps {
  intensidades: Intensidades
  clicsPerfil:  { x: number, y: number, intensidad: number }[]
}


export function PerfilReplica({ intensidades,  clicsPerfil= []  }: PerfilReplicaProps) {

  const maxIntensidad = clicsPerfil.length > 0  // ← proteger
        ? Math.max(...clicsPerfil.map(c => c.intensidad), 1)
        : 1

  const slug = useAuthStore((state) => state.user?.portafolio?.slug);
  const { data, loading, noDisponible } = usePortfolioData(slug);

  if (!slug)        return <div>No tienes un portafolio asignado.</div>;
  if (loading)      return <div>Cargando...</div>;
  if (noDisponible || !data) return <div>Portafolio no disponible.</div>;

  const { usuario, habilidadesTecnicas, habilidadesBlandas, experiencias, proyectos, configuracion, certificaciones } = data;

  return (
    <>
        <HeatmapSeccion puntos={clicsPerfil} maxIntensidad={maxIntensidad}>
          <PortfolioHeader usuario={usuario} />
        </HeatmapSeccion>

      {configuracion?.mostrar_habilidades && (
        <>
            <HabilidadesTecnicas tecnicas={habilidadesTecnicas} onExpandir={() => {}} onCerrar={() => {}} />
            <HabilidadesBlandas blandas={habilidadesBlandas} />
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