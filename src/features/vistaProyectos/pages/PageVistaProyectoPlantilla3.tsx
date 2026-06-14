import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Info,
  CalendarDays,
  Globe,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from "lucide-react";

import { useVistaProyecto } from "../hooks/useVistaProyecto";

export default function PageVistaProyectoPlantilla3() {
  const navigate = useNavigate();

  const { slug, id } = useParams<{
    slug: string;
    id: string;
  }>();

  const { proyecto, loading, error } =
    useVistaProyecto(id ?? "");

  const [indexActual, setIndexActual] =
    useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando proyecto...
      </div>
    );
  }

  if (error || !proyecto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error al cargar proyecto
      </div>
    );
  }

  const imagenes = proyecto.url_imagen ?? [];

  return (
    <main className="min-h-screen bg-[#eef3f3] py-6 px-4">
      <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-[#f2b5d4]/40 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-[#7bdff2]/30 blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto">
        {/* tarjeta principal */}
        <div className="relative bg-[#f8f8f8] border-4 border-[#1f2a44] rounded-[36px] p-6 md:p-8 shadow-[14px_14px_0px_0px_#f2b5d4] overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between border-b pb-5">

            <button
              onClick={() =>
                navigate(`/portafolio/${slug}`)
              }
              className="bg-white hover:bg-slate-50 border-2 border-[#1f2a44] font-black px-5 py-2 rounded-xl text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#1f2a44] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 text-[#1f2a44]"
            >
              <ArrowLeft size={14} />
              Volver
            </button>

            <span className="bg-[#b2f7ef] border-2 border-[#1f2a44] text-[#1f2a44] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-[2px_2px_0px_0px_#1f2a44]">
              Ficha del proyecto
            </span>
          </div>

          {/* contenido */}
          <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-6 mt-6">

            {/* izquierda */}
            <section className="space-y-3">

              <div className="mb-5">
                <p className="flex items-center gap-2 text-[#f2b5d4] text-[11px] uppercase font-black tracking-[0.2em]">
                  <Info size={14} />
                  Detalles del proyecto
                </p>

                <h1 className="mt-2 text-5xl lg:text-7xl font-black uppercase tracking-tight text-[#0b1f4d] leading-none">
                  {proyecto.nombre}
                </h1>
              </div>

              <div className="mb-8">

                <h2 className="font-black text-xl text-[#98a1b3] uppercase tracking-tight text-center">
                  Sobre el proyecto
                </h2>

                <div className="bg-[#eff7f6] border-[3px] border-[#1f2a44] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1f2a44]">
                  <p className="text-sm leading-relaxed">
                    {proyecto.descripcion}
                  </p>
                </div>

              </div>

              {/* tecnologías */}
              <div>

                <p className=" text-xs uppercase font-black text-slate-400 mb-3">
                  {"</>"} Tecnologías utilizadas
                </p>

                <div className="flex flex-wrap gap-3 bg-[#eff7f6]/50 border-[3px] border-[#1f2a44] rounded-[28px] p-5">
                  {proyecto.tecnologias.map((tech) => (
                    <div
                      key={tech.id_tecnologia}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#1f2a44] shadow-[2.5px_2.5px_0px_0px_#1f2a44]"
                    >
                      {tech.logo && (
                        <img
                          src={tech.logo}
                          alt={tech.nombre}
                          className="
                            w-4 h-4
                            object-contain
                          "
                        />
                      )}

                      <span className="
                        text-[10px]
                        font-black
                        uppercase
                      ">
                        {tech.nombre}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

            </section>

            {/* derecha */}
            <section className="space-y-5">

              {/* fechas */}
              <div className="bg-[#264653] text-white rounded-[18px] p-2 border-[3px] border-[#264653] shadow-[4px_4px_0px_0px_#1f2a44] grid grid-cols-2 gap-4">
                <div className="text-center">
                  <span className="
                    text-[8px]
                    uppercase
                    font-black
                    text-cyan-200
                  ">
                    Fecha de inicio
                  </span>

                  <p className=" mt-2 text-xs font-black flex items-center justify-center gap-1">
                    <CalendarDays size={14} />
                    {proyecto.fecha_inicio}
                  </p>
                </div>

                <div className="text-center">
                  <span className=" text-[8px] uppercase font-black text-pink-200">
                    Fecha de cierre
                  </span>

                  <p className=" mt-2 text-xs font-black flex items-center justify-center gap-1">
                    <CalendarDays size={14} />
                    {proyecto.fecha_fin}
                  </p>
                </div>

              </div>

              {/* carrusel */}
              <div className="bg-white border-4 border-[#1f2a44] rounded-[30px] p-4 shadow-[6px_6px_0px_0px_#1f2a44]">

                <div className="w-full h-60 bg-slate-950 rounded-[18px] overflow-hidden border-[3px] border-[#1f2a44] relative">

                  {imagenes.length > 0 ? (
                    <img
                      src={
                        imagenes[indexActual].logo
                      }
                      alt={
                        imagenes[indexActual].nombre
                      }
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />
                  ) : (
                    <div className="
                      w-full h-full
                      flex items-center
                      justify-center
                    ">
                      <ImageOff size={50} />
                    </div>
                  )}

                  {imagenes.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setIndexActual(
                            indexActual === 0
                              ? imagenes.length - 1
                              : indexActual - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white border-2 border-[#1f2a44] rounded-full p-2 shadow-md">
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        onClick={() =>
                          setIndexActual(
                            indexActual ===
                              imagenes.length - 1
                              ? 0
                              : indexActual + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border-2 border-[#1f2a44] rounded-full p-2 shadow-md">
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                {imagenes.length > 1 && (
                  <div className="
                    grid grid-cols-3 gap-2 mt-3
                  ">
                    {imagenes.map(
                      (img, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setIndexActual(index)
                          }
                          className={`aspect-16/10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${indexActual === index ? "border-[#f2b5d4] shadow-inner scale-95" : "border-[#1f2a44]"}`}
                        >
                          <img
                            src={img.logo}
                            alt={img.nombre}
                            className="
                              w-full
                              h-20
                              object-cover
                            "
                          />
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* botones */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={
                    proyecto.url_github ?? "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className=" flex items-center justify-center gap-2 py-2 rounded-2xl border-2 border-[#1d2b44] bg-white font-black uppercase text-xs
                  "
                >
                <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" 
                    className="w-8 h-8" 
                    alt="GitHub" 
                  />
                </a>

                {proyecto.url_demo ? (
                  <a
                    href={proyecto.url_demo}
                    target="_blank"
                    rel="noreferrer"
                    className=" flex items-center justify-center gap-2 py-2 rounded-2xl border-2 border-[#1d2b44] bg-[#7bdff2] font-black uppercase text-xs"
                  >
                    <Globe size={16} />
                    Demo
                  </a>
                ) : (
                  <div className=" flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-slate-300 bg-slate-100 text-slate-400 font-black uppercase text-xs">
                    <Globe size={16} />
                    Demo inactiva
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}