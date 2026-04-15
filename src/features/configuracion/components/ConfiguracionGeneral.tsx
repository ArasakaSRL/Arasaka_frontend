import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
  titulo: string;
  children: React.ReactNode;
  withToggle?: boolean; // 👈 opcional (como SeccionVisibilidad)
}

export function ConfiguracionGeneral({ 
  titulo, 
  children, 
  withToggle = false 
}: Props) {

  const [activo, setActivo] = useState(true);

  // 👇 opcional: desactivar hijos como en SeccionVisibilidad
  const childrenWithProps = Array.isArray(children)
    ? children.map((child) => {
        if (typeof child === "object" && child !== null && "props" in child) {
          return {
            ...child,
            props: {
              ...child.props,
              disabled: !activo,
            },
          };
        }
        return child;
      })
    : children;

  return (
    <div className="space-y-3">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl text-dark-500 font-medium-ui">
          {titulo}
        </h3>

        {withToggle && (
          <button onClick={() => setActivo(!activo)}>
            {activo ? (
              <Eye className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* CONTENEDOR */}
      <div
        className={`
          w-full p-4 border rounded-xl bg-gray-50 transition-all
          ${!activo ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <div className="flex flex-col gap-4">
          {childrenWithProps}
        </div>
      </div>

    </div>
  );
}