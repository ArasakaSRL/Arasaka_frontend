import type { Tecnologias } from "@/features/proyectos/lib/ProyectosApi";

interface Props {
  tecnologias: Tecnologias[];
}

export const TecnologiasList = ({ tecnologias }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tecnologias.map((tech) => (
        <span
          key={tech.id_tecnologia}
          className="px-3 py-1 border border-indigo-900 rounded-full text-sm text-indigo-900"
        >
          {tech.nombre}
        </span>
      ))}
    </div>
  );
};