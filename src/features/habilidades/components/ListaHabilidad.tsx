import {
  type HabilidadUI
} from "../lib/HabilidadesApi";
import HabilidadItem from "./CardHabilidad";

interface Props {
  habilidad: HabilidadUI[];
  load: boolean;
  onEditar: (habilidad: HabilidadUI) => void;
}

export default function HabilidadesList({ habilidad, load, onEditar }: Props) {
  if (load) return <p>Cargando...</p>;

const tecnicas = habilidad.filter(
  (h) => h.categoria.toLowerCase() === "tecnica"
);

const blandas = habilidad.filter(
  (h) => h.categoria.toLowerCase() === "blanda"
);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* técnicas */}
      <div className="border rounded-xl p-4 bg-white">
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
            tecnicas.map((hab) => (
              <HabilidadItem
                key={hab.id_habilidad}
                nombre={hab.nombre}
                nivel={hab.id_nivel_habilidad}
                onEditar={() => onEditar(hab)}
              />
            ))
          )}
        </div>
      </div>

      {/* blandas */}
      <div className="border rounded-xl p-4 bg-white">
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
            blandas.map((hab) => (
              <HabilidadItem
                key={hab.id_habilidad}
                nombre={hab.nombre}
                nivel={hab.id_nivel_habilidad}
                onEditar={() => onEditar(hab)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}