import { useAuthStore } from '@/stores/authStore';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import PortfolioHeader from '@/features/portafolio/components/PortfolioHeader ';
import HabilidadesTecnicas from '@/features/portafolio/components/HabilidadesTecnicas';
import HabilidadesBlandas from '@/features/portafolio/components/HabilidadesBlandas';
import ExperienceTimeline from '@/features/portafolio/components/ExperienceTimeline';
import SeccionProyectos from '@/features/portafolio/components/SeccionProyectos';
import { CertificacionesSection } from '@/features/portafolio/components/CertificacionesSection';
import { HeatmapSeccion } from '../heatmap/HeatmapSeccion';

type Clics = { x: number; y: number; intensidad: number }[]
interface Intensidades {
  perfil: number
  tecnicas: number
}

interface PerfilReplicaProps {
  intensidades: Intensidades
  clicsPerfil?:       Clics
  clicsTecnicas?:     Clics
  clicsBlandas?:      Clics
  clicsExperiencia?:  Clics
  clicsProyectos?:    Clics
  clicsCertificaciones?: Clics
}

function calcMax(clics: Clics): number {
    return clics.length > 0 ? Math.max(...clics.map(c => c.intensidad), 1) : 1
}

export function PerfilReplica({ 
  intensidades,  
  clicsPerfil= [],
  clicsTecnicas      = [],
  clicsBlandas       = [],
  clicsExperiencia   = [],
  clicsProyectos     = [],
  clicsCertificaciones = [], 

}: PerfilReplicaProps) {

  const maxIntensidad = calcMax(clicsPerfil)

  const slug = useAuthStore((state) => state.portafolioSeleccionado?.slug);
  const { data, loading, noDisponible } = usePortfolioData(slug);

  if (!slug)        return <div>No tienes un portafolio asignado.</div>;
  if (loading)      return <div>Cargando...</div>;
  if (noDisponible || !data) return <div>Portafolio no disponible.</div>;

  const { usuario, habilidadesTecnicas, habilidadesBlandas, experiencias, proyectos, configuracion, certificaciones } = data;

  return (
    <>
        <HeatmapSeccion puntos={clicsPerfil} maxIntensidad={maxIntensidad}>
           <PortfolioHeader
                usuario={usuario}
                proyectos={configuracion?.mostrar_proyectos ? proyectos : []}
                tecnicas={configuracion?.mostrar_habilidades ? habilidadesTecnicas : []}
                blandas={configuracion?.mostrar_habilidades ? habilidadesBlandas : []}
                experiencias={configuracion?.mostrar_experiencias ? experiencias : []}
                certificaciones={configuracion?.mostrar_certificaciones ? certificaciones : []}
            />
        </HeatmapSeccion>

      {configuracion?.mostrar_habilidades && (
        <>
            <HeatmapSeccion puntos={clicsTecnicas} maxIntensidad={calcMax(clicsTecnicas)}>
              <HabilidadesTecnicas tecnicas={habilidadesTecnicas} onExpandir={() => {}} onCerrar={() => {}} />
            </HeatmapSeccion>
            <HeatmapSeccion puntos={clicsBlandas} maxIntensidad={calcMax(clicsBlandas)}>
              <HabilidadesBlandas blandas={habilidadesBlandas} />
            </HeatmapSeccion>
        </>
      )}

      {configuracion?.mostrar_experiencias && (
        <HeatmapSeccion puntos={clicsExperiencia} maxIntensidad={calcMax(clicsExperiencia)}>
          <ExperienceTimeline experiencias={experiencias} />
        </HeatmapSeccion>
        
      )}

      {configuracion?.mostrar_proyectos && (
        <HeatmapSeccion puntos={clicsProyectos} maxIntensidad={calcMax(clicsProyectos)}>
          <SeccionProyectos proyectos={proyectos} />
        </HeatmapSeccion>
        
      )}

      {configuracion?.mostrar_certificaciones && (
        <HeatmapSeccion puntos={clicsCertificaciones} maxIntensidad={calcMax(clicsCertificaciones)}>
          <CertificacionesSection certificaciones={certificaciones} />
        </HeatmapSeccion>
      )}
    </>
  );
}