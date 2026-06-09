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

const config = data?.configuracion;

  const [tabActiva, setTabActiva] = useState(
    ""
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

  const tabs = [];

    if (config?.mostrar_habilidades) {
      tabs.push(
        {
          id: "habilidades-tecnicas",
          label: "Habilidades Técnicas",
        },
        {
          id: "habilidades-blandas",
          label: "Habilidades Blandas",
        }
      );
    }

    if (config?.mostrar_experiencias) {
      tabs.push({
        id: "experiencia",
        label: "Experiencia",
      });
    }

    if (config?.mostrar_proyectos) {
      tabs.push({
        id: "proyectos",
        label: "Proyectos",
      });
    }

    if (config?.mostrar_certificaciones) {
      tabs.push({
        id: "certificaciones",
        label: "Certificaciones",
      });
    }

  return (
    <div className="bg-white rounded-lg p-4">

      <BotonMultiple
        defaultTab={tabs[0]?.id}
        tabs={tabs}
        onChange={(tab) => setTabActiva(tab)}
      />

      <div className="mt-6">
        {config?.mostrar_habilidades &&
          tabActiva === "habilidades-tecnicas" && (
            <HabilidadesTecnicas
              tecnicas={habilidadesTecnicas}
              onExpandir={() => {}}
              onCerrar={() => {}}
              mostrarTitulo={false}
            />
        )}

        {config?.mostrar_habilidades && 
          tabActiva === "habilidades-blandas" && (
            <HabilidadesBlandas
              blandas={habilidadesBlandas}
              mostrarTitulo={false}
            />
          )}
          
        { config?.mostrar_experiencias &&
        tabActiva === "experiencia" && (
          <ExperienceTimeline
            experiencias={experiencias}
            mostrarTitulo={false}
          />
        )}


        { config?.mostrar_proyectos &&
        tabActiva === "proyectos" && (
          <SeccionProyectos
            proyectos={proyectos}
            mostrarTitulo={false}
          />
        )}

        {config?.mostrar_certificaciones &&
        tabActiva === "certificaciones" && (
          <CertificacionesSection
            certificaciones={certificaciones}
            mostrarTitulo={false}
          />
        )}
      </div>

    </div>
  );
}