
interface Card {
    id: string;
    nombre: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin?: string;
    tecnologias: string[];
}

interface Props {
    proyecto:Card;
}
export default function CardProyectos ({proyecto}:Props) {
    return(
        <div className="flex text-left border-2 border-primary-500 rounded-xl p-5 flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">
          {proyecto.nombre}
        </h3>

        <p className="text-xs text-gray-500 mt-1 py-2">
          {proyecto.fecha_inicio} - {proyecto.fecha_fin || "Actualidad"}
        </p>

        <p className="text-sm text-gray-600 mt-3">
          {proyecto.descripcion}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {proyecto.tecnologias.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 border hover:bg-secondary-500 hover:text-white border-primary-400 rounded-md text-primary-500"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition">
            Editar
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-error-500 text-white rounded-md hover:bg-error-600 transition">
            Eliminar
        </button>
      </div>
        </div>
    )

}
