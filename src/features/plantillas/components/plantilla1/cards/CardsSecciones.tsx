import { useState } from "react";

import HabilidadesTecnicas from "@/features/portafolio/components/HabilidadesTecnicas";
import HabilidadesBlandas from "@/features/portafolio/components/HabilidadesBlandas";
import ExperienceTimeline from "@/features/portafolio/components/ExperienceTimeline";
import SeccionProyectos from "@/features/portafolio/components/SeccionProyectos";
import { CertificacionesSection } from "@/features/portafolio/components/CertificacionesSection";

import BotonMultiple from "../botones/BotonMultiple";

import { useParams } from "react-router-dom";
import { usePortfolioData } from "@/features/reportesUsuario/hooks/usePortfolioData";

export default function CardsSecciones() {
  const { slug } = useParams<{ slug: string }>();

  const { data, loading, noDisponible } =
    usePortfolioData(slug);

  const [tabActiva, setTabActiva] = useState(
    "habilidades-tecnicas"
  );

  if (!slug)
    return <div>No tienes un portafolio asignado.</div>;

  if (loading)
    return <div>Cargando...</div>;

  if (noDisponible || !data)
    return <div>Portafolio no disponible.</div>;

  const {
    habilidadesTecnicas,
    habilidadesBlandas,
    experiencias,
    proyectos,
    certificaciones,
  } = data;

  return (
    <div className="bg-white rounded-lg p-4">

      <BotonMultiple
        defaultTab={tabActiva}
        tabs={[
          {
            id: "habilidades-tecnicas",
            label: "Habilidades Técnicas",
          },
          {
            id: "habilidades-blandas",
            label: "Habilidades Blandas",
          },
          {
            id: "experiencia",
            label: "Experiencia",
          },
          {
            id: "proyectos",
            label: "Proyectos",
          },
          {
            id: "certificaciones",
            label: "Certificaciones",
          },
        ]}
        onChange={(tab) => setTabActiva(tab)}
      />

      <div className="mt-6">
        {tabActiva === "habilidades-tecnicas" && (
          <HabilidadesTecnicas
            tecnicas={habilidadesTecnicas}
            onExpandir={() => {}}
            onCerrar={() => {}}
            mostrarTitulo={false}
          />
        )}

        {tabActiva === "habilidades-blandas" && (
          <HabilidadesBlandas
            blandas={habilidadesBlandas}
            mostrarTitulo={false}
          />
        )}

        {tabActiva === "experiencia" && (
          <ExperienceTimeline
            experiencias={experiencias}
            mostrarTitulo={false}
          />
        )}

        {tabActiva === "proyectos" && (
          <SeccionProyectos
            proyectos={proyectos}
            mostrarTitulo={false}
          />
        )}

        {tabActiva === "certificaciones" && (
          <CertificacionesSection
            certificaciones={certificaciones}
            mostrarTitulo={false}
          />
        )}
      </div>

    </div>
  );
}