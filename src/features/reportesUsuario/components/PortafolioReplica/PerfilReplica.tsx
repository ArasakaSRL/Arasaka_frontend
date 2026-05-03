import { useAuthStore } from '@/stores/authStore';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import PortfolioHeader from '@/features/portafolio/components/PortfolioHeader ';
import HabilidadesTecnicas from '@/features/portafolio/components/HabilidadesTecnicas';
import HabilidadesBlandas from '@/features/portafolio/components/HabilidadesBlandas';
import ExperienceTimeline from '@/features/portafolio/components/ExperienceTimeline';
import SeccionProyectos from '@/features/portafolio/components/SeccionProyectos';
import { CertificacionesSection } from '@/features/portafolio/components/CertificacionesSection';

export function PerfilReplica() {
  const slug = useAuthStore((state) => state.user?.portafolio?.slug);
  const { data, loading, noDisponible } = usePortfolioData(slug);

  if (!slug)        return <div>No tienes un portafolio asignado.</div>;
  if (loading)      return <div>Cargando...</div>;
  if (noDisponible || !data) return <div>Portafolio no disponible.</div>;

  const { usuario, habilidadesTecnicas, habilidadesBlandas, experiencias, proyectos, configuracion, certificaciones } = data;

  return (
    <>
      <PortfolioHeader usuario={usuario} />

      {configuracion?.mostrar_habilidades && (
        <>
          <HabilidadesTecnicas tecnicas={habilidadesTecnicas} onExpandir={() => {}} onCerrar={() => {}} />
          <HabilidadesBlandas blandas={habilidadesBlandas} />
        </>
      )}

      {configuracion?.mostrar_experiencias && (
        <ExperienceTimeline experiencias={experiencias} />
      )}

      {configuracion?.mostrar_proyectos && (
        <SeccionProyectos proyectos={proyectos} />
      )}

      {configuracion?.mostrar_certificaciones && (
        <CertificacionesSection certificaciones={certificaciones} />
      )}
    </>
  );
}