import { useState } from "react";
import type { Proyecto, Tecnologias } from "../lib/ProyectosApi";
import {CircleX} from "lucide-react";

interface Props {
    proyecto:Proyecto;
    onEditar: (proyecto: Proyecto) => void;
}
export default function CardProyectos ({proyecto, onEditar}:Props) {
  // const cleanText = (proyecto.descripcion || "").replace(/<[^>]+>/g, "");
  const tecnlogiasVisibles = proyecto.tecnologias.slice(0, 3);
  const tecnologiasOcultas = proyecto.tecnologias.length - 3;

  const portada = proyecto.url_imagen?.[0]?.logo;
  const extraImg = (proyecto.url_imagen?.length || 0) - 1;

  const [openGaleria, setOpenGaleria] = useState(false);

    return(
    <>
      <div className="flex text-left border-2 border-primary-500 rounded-xl p-5 flex-col justify-between overflow-hidden">
        
        {/* 🔹 IMAGEN */}
        {portada && (
          <div
            className="relative w-full h-40 mb-3 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setOpenGaleria(true)}
          >
            <img
              src={portada}
              alt="portada"
              className="w-full h-full object-cover"
            />

            {extraImg > 0 && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                +{extraImg}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col justify-between w-full min-w-0">
          <h3 className="text-sm font-semibold text-gray-800">
            {proyecto.nombre}
          </h3>

          <p className="text-xs text-gray-500 mt-1 py-2">
            {proyecto.fecha_inicio} - {proyecto.fecha_fin || "Actualidad"}
          </p>

          <p className="text-sm text-gray-600 mt-3 line-clamp-3 break-words">
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
              <span className="text-[10px] px-2 py-1 border border-primary-400 rounded-md text-gray-500 hover:bg-secondary-500 hover:text-white">
                +{tecnologiasOcultas}
              </span>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-2 mt-4">
            <button
              onClick={() => onEditar(proyecto)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary-500 text-primary-500 rounded-md hover:bg-secondary-500 hover:text-white transition"
            >
              Editar
            </button>
          </div>
        </div>
      </div>

      {openGaleria && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full relative">

            {/* cerrar */}
            <button
              onClick={() => setOpenGaleria(false)}
              className="absolute top-2 right-2 text-primary-500 text-xl cursor-pointer hover:text-primary-700 transition"
            >
              <CircleX />
            </button>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {proyecto.url_imagen.map((img, i) => (
                <img
                  key={i}
                  src={img.logo}
                  className="w-full h-40 object-cover rounded"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
    )
}
