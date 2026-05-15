import type { Proyecto } from "../lib/ProyectosApi";
import CardProyectos from "./CardProyectos";

interface Props {
  proyectos: Proyecto[];
  loading: boolean;
  modoAccion: "editar" | "eliminar" | null;
  onEditar: (proyecto: Proyecto) => void;
  onEliminar: (
    proyecto: Proyecto
  ) => void;
}

export default function ListaProyectos({
  proyectos,
  loading,
  modoAccion,
  onEditar,
  onEliminar,
}: Props) {

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      {proyectos.map((proyecto) => (
        <CardProyectos
          key={proyecto.id_proyecto}
          proyecto={proyecto}
          editable={modoAccion === "editar"}
          eliminando={modoAccion === "eliminar"}
          onSelect={() => {
            if (modoAccion === "editar") {
              onEditar(proyecto);
              return;
            }
            if (modoAccion === "eliminar") {
              onEliminar(proyecto);
            }
          }}
        />
      ))}
    </div>
  );
}