import { useState } from "react";
import type { Proyecto, Tecnologias } from "../lib/ProyectosApi";
import {CircleX, Images, Star} from "lucide-react";

interface Props {
    proyecto:Proyecto;
    editable?: boolean;
    eliminando?: boolean;
    onSelect?: () => void;
}
export default function CardProyectos ({proyecto, editable, eliminando, onSelect}:Props) {
  const tecnlogiasVisibles = proyecto.tecnologias.slice(0, 3);
  const tecnologiasOcultas = proyecto.tecnologias.length - 3;

  const [openGaleria, setOpenGaleria] = useState(false);

  console.log( "proyectos:", proyecto.nombre, proyecto.url_imagen);

    return(
    <>
      <div   
      onClick={onSelect}
      className={`flex text-left rounded-xl p-5 flex-col justify-between overflow-hidden transition-all border-2
        ${
          editable
            ? `
              cursor-pointer
              border-blue-200
              hover:border-blue-500
              hover:bg-blue-50
            `
            : eliminando
            ? `
              cursor-pointer
              border-red-200
              hover:border-red-500
              hover:bg-red-50
            `
            : `
              border-primary-500
            `
        }
      `}> 
        <div className="flex flex-col justify-between w-full min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
          <h3 className="text-sm font-semibold text-gray-800">
            {proyecto.nombre}
          </h3>

          <p className="text-xs text-gray-500 mt-1 py-2">
            {proyecto.fecha_inicio} - {proyecto.fecha_fin || "Actualidad"}
          </p>
          </div>
          <div>    
          {proyecto.url_imagen?.length > 0 && (
            <button
              onClick={() => setOpenGaleria(true)}
              className="text-primary-500 hover:text-primary-700 transition cursor-pointer bg-primary-100 p-1 rounded-md"
            >
              <Images size={18} />
            </button>
          )}
          </div>
          </div>

          <p className="text-sm text-gray-600 mt-3 line-clamp-3 wrap-break-word">
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
                <div key={i} className="relative">
                  <img
                    src={img.url_imagen}
                    className="w-full h-40 object-cover rounded"
                  />

                  {/* indicador portada */}
                  {i === 0 && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-white p-1 rounded-full shadow">
                      <Star size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
    )
}
