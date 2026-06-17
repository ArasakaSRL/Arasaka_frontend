import { ArrowUpRight, Laptop, ExternalLink, LayoutPanelLeft } from "lucide-react";
import type { Proyectos } from "@/features/portafolio/types/portafolioType";
import { useNavigate, useParams, useLocation } from "react-router-dom";
type Props = {
  proyectos: Proyectos[];
};

export default function ProyectosPastel({ proyectos }: Props) {

  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const esPrivado =
    location.pathname.includes("/privado/");
  const navegarProyecto = (
    idProyecto: string
  ) => {

    const rutaBase = esPrivado
      ? `/portafolio/privado/${slug}`
      : `/portafolio/${slug}`;

    navigate(
      `${rutaBase}/proyectos/${idProyecto}`
    );
  };
  return (
    <section className="bg-white border-4 border-slate-900 rounded-[36px] p-6 md:p-8 shadow-[14px_14px_0px_0px_rgba(242,181,212,1)] space-y-6">
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#b2f7ef] border-2 border-slate-900 flex items-center justify-center">
            <LayoutPanelLeft size={20} color="black" />
          </div>
          <h3 className="font-black text-xl tracking-tight text-slate-900 uppercase">
            Mis Proyectos
          </h3>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {proyectos.map((proyecto) => (

          <div
            key={proyecto.id_proyecto}
            className="bg-[#eff7f6]/40 p-4 rounded-3xl border-2 border-slate-900 hover:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition duration-300 flex flex-col justify-between space-y-4 group"
          >

            <div className="space-y-3">

              {/* Imagen */}
              <div className="w-full aspect-16/10 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-900 relative">

                {proyecto.imagenes?.length > 0 ? (
                  <img
                    src={proyecto.imagenes[0].url}
                    alt={proyecto.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f2b5d4] flex items-center justify-center">
                    <Laptop className="w-10 h-10 text-white" />
                  </div>
                )}

                <div className="absolute top-2 left-2 bg-[#b2f7ef] border border-slate-900 text-slate-900 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                  Proyecto
                </div>

              </div>

              {/* Título */}
              <div className="space-y-1">

                <h4 className="font-black text-lg text-slate-900 tracking-tight group-hover:text-[#f2b5d4] transition">
                  {proyecto.nombre}
                </h4>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">

              <span className="text-[10px] text-slate-500 font-extrabold uppercase">
                {proyecto.estados?.[0] || ""}
              </span>

              <div className="flex items-center gap-2">

                {proyecto.url_repositorio && (
                  <a
                    href={proyecto.url_repositorio}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white border-2 border-slate-900 p-2 rounded-xl hover:bg-[#b2f7ef]"
                  >
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" 
                    className="w-6 h-6" 
                    alt="GitHub" 
                  />
                  </a>
                )}

                {proyecto.url_demo && (
                  <a
                    href={proyecto.url_demo}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white border-2 border-slate-900 p-2 rounded-xl hover:bg-[#7bdff2]"
                  >
                    <ExternalLink size={14} color="black"/>
                  </a>
                )}

                <button
                  onClick={() =>
                    navegarProyecto(
                      proyecto.id_proyecto
                    )
                  }
                  className="bg-[#f2b5d4] hover:bg-[#f2b5d4]/90 text-slate-900 border-2 border-slate-900 font-black px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                >
                  Ver Ficha
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}