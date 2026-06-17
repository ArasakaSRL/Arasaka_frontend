import {
  type HabilidadUI
} from "../lib/HabilidadesApi";
import HabilidadItem from "./CardHabilidad";
import Paginacion from "@/components/Paginacion";
import { useState } from "react";

interface Props {
  habilidad: HabilidadUI[];
  load: boolean;
  onEditar: (habilidad: HabilidadUI) => void;
  onEliminar: (habilidad: HabilidadUI) => void;
  modoAccion: "editar" | "eliminar" | null;
}

export default function HabilidadesList({ 
  habilidad, 
  load, 
  onEditar, 
  onEliminar, 
  modoAccion
}: Props) {
  const [paginaTecnicas, setPaginaTecnicas] = useState(1);
  const [paginaBlandas, setPaginaBlandas] = useState(1);

  if (load) return <p>Cargando habilidades...</p>;

  const tecnicas = habilidad.filter(
    (h) => h.categoria === "tecnica"
  );

  const blandas = habilidad.filter(
    (h) => h.categoria === "blanda"
  );

  const itemsPorPagina = 5;

  const totalPaginasTecnicas = Math.ceil(
    tecnicas.length / itemsPorPagina
  );

  const tecnicasPaginadas = tecnicas.slice(
    (paginaTecnicas - 1) * itemsPorPagina,
    paginaTecnicas * itemsPorPagina
  );

  const totalPaginasBlandas = Math.ceil(
    blandas.length / itemsPorPagina
  );

  const blandasPaginadas = blandas.slice(
    (paginaBlandas - 1) * itemsPorPagina,
    paginaBlandas * itemsPorPagina
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* técnicas */}
      <div className=" border rounded-xl p-4 bg-white flex flex-col h-140">
        <h3 className="font-semibold text-black mb-2 text-left">
          Habilidades Técnicas
        </h3>
        <h2 className="text-xs text-gray-600 mb-4 text-left">
          Lenguajes, frameworks, herramientas, etc.
        </h2>

        <div className="space-y-3">
          {tecnicas.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay habilidades técnicas</p>
          ) : (
            tecnicasPaginadas.map((hab) => (
              <HabilidadItem
                key={hab.id_habilidad}
                nombre={hab.nombre}
                nivel={hab.nivel}
                editable={modoAccion === "editar"}
                eliminando={modoAccion === "eliminar"}
                onSelect={() => {
                  if (modoAccion === "editar") {
                    onEditar(hab);
                    return;
                  }
                  if (modoAccion === "eliminar") {
                    onEliminar(hab);
                    return;
                  }
                }}
              />
            ))
          )}
        </div>
        <Paginacion
          currentPage={paginaTecnicas}
          totalPages={totalPaginasTecnicas}
          onPageChange={setPaginaTecnicas}
        />
      </div>

      {/* blandas */}
      <div className=" border rounded-xl p-4 bg-white flex flex-col h-140">
        <h3 className="font-semibold text-black mb-2 text-left">
          Habilidades Blandas
        </h3>
        <h2 className="text-xs text-gray-600 mb-4 text-left">
          Habilidades sociales, comunicativas y de trabajo en equipo
        </h2>

        <div className="space-y-3">
          {blandas.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay habilidades blandas</p>
          ) : (
            blandasPaginadas.map((hab) => (
              <HabilidadItem
                key={hab.id_habilidad}
                nombre={hab.nombre}
                nivel={hab.nivel}
                editable={modoAccion === "editar"}
                eliminando={modoAccion === "eliminar"}
                onSelect={() => {
                  if (modoAccion === "editar") {
                    onEditar(hab);
                    return;
                  }
                  if (modoAccion === "eliminar") {
                    onEliminar(hab);
                    return;
                  }
                }}
              />
            ))
          )}
        </div>
        <Paginacion
          currentPage={paginaBlandas}
          totalPages={totalPaginasBlandas}
          onPageChange={setPaginaBlandas}
        />
      </div>
    </div>
  );
}