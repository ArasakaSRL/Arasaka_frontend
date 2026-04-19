import type { Proyecto, Tecnologias } from "../lib/ProyectosApi";

interface Props {
    proyecto:Proyecto;
    onEditar: (proyecto: Proyecto) => void;
}
export default function CardProyectos ({proyecto, onEditar}:Props) {
  // const cleanText = (proyecto.descripcion || "").replace(/<[^>]+>/g, "");
  const tecnlogiasVisibles = proyecto.tecnologias.slice(0, 3);
  const tecnologiasOcultas = proyecto.tecnologias.length - 3;
    return(
      <div className="flex text-left border-2 border-primary-500 rounded-xl p-5 flex-col justify-between overflow-hidden">
        <div className="flex flex-col justify-between w-full min-w-0">
          <h3 className="text-sm font-semibold text-gray-800">
            {proyecto.nombre}
          </h3>

          <p className="text-xs text-gray-500 mt-1 py-2">
            {proyecto.fecha_inicio} - {proyecto.fecha_fin || "Actualidad"}
          </p>

          <p
           
          className="text-sm text-gray-600 mt-3 line-clamp-3 wrap-break-word" >
            {proyecto.descripcion}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {tecnlogiasVisibles.map((tech: Tecnologias) => (
              <span
                key={tech.id_tecnologia}
                className="text-[10px] px-2 py-1 border hover:bg-secondary-500 hover:text-white border-primary-400 rounded-md text-primary-500"
              >
                {tech.nombre}
              </span>
            ))}

            {tecnologiasOcultas > 0 && (
              <span className="text-[10px] px-2 py-1 border border-gray-400 rounded-md text-gray-500">
                +{tecnologiasOcultas}
              </span>
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-2 mt-4">
          <button
          onClick={() => onEditar(proyecto)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary-500 text-primary-500 rounded-md hover:bg-secondary-500 hover:text-white transition">
              Editar
          </button>

          {/* <button 
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-700 transition">
              Eliminar
          </button> */}
        </div>
        </div>
      </div>
    )
}
