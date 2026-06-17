import React from 'react';
import { ExternalLink, Code2, ArrowUpRight ,LayoutPanelLeft} from 'lucide-react';
import type { Proyectos as Proyecto } from '../types/portafolioType';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
const SeccionProyectos = ({ proyectos, mostrarTitulo = true, }: { proyectos: Proyecto[], mostrarTitulo?: boolean, }) => {
  const { slug } = useParams();
  return (
    <div className="w-full  max-w-5xl mx-auto p-4 md:p-12 font-sans bg-white">

     {mostrarTitulo && (
    <div className="flex flex-col mb-16 px-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
            <LayoutPanelLeft
              size={28}
              className="text-blue-600"
              strokeWidth={2.5}
            />
          </div>

          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#0a1120]">
              Proyectos
            </h2>

            <div className="h-1.5 w-10 bg-blue-600/30 rounded-full mt-1" />
          </div>
        </div>
      </div>
    </div>
  )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {proyectos.map((proyecto) => (
          <CardProyectoVertical key={proyecto.id_proyecto} proyecto={proyecto} slug={slug ?? ''} />
        ))}
      </div>
    </div>
  );
};

const CardProyectoVertical = ({ proyecto, slug }: { proyecto: Proyecto; slug: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const esPrivado = location.pathname.includes('/privado/');
    const handleNavegarDetalle = () => {
      const rutaBase = esPrivado ? `/portafolio/privado/${slug}` : `/portafolio/${slug}`;
      navigate(`${rutaBase}/proyectos/${proyecto.id_proyecto}`);
    }
  return (
    <div onClick={handleNavegarDetalle} data-proyecto-action="clic_general" data-proyecto-id={proyecto.id_proyecto} className="group relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-[#0a1120] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20">
      <div className="absolute inset-0">
        {proyecto.imagenes?.length > 0 ? (
          <img 
            src={proyecto.imagenes[0].url} 
            alt={proyecto.nombre} 
            className="w-full h-full object-cover opacity-90 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-40"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <Code2 size={40} className="text-slate-700" />
          </div>
        )}
      </div>

  
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

   
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
   
        <div className="flex flex-wrap gap-2 mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          {proyecto.tecnologias.map((tech) => (
            <div key={tech.nombre} className="p-1.5 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
              <img src={tech.logo} className="w-3.5 h-3.5 object-contain" alt={tech.nombre} />
            </div>
          ))}
        </div>

       
        <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none mb-3">
            {proyecto.nombre}
          </h3>
          
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-6">
            {proyecto.descripcion}
          </p>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-6">
          </p>

       
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            <div className="flex gap-4">
              {proyecto.url_repositorio && (
                <a href={proyecto.url_repositorio}  data-proyecto-action="clic_github" target="_blank" className="text-white/70 hover:text-white transition-colors">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" 
                    className="w-5 h-5 invert opacity-70 hover:opacity-100" 
                    alt="GitHub" 
                  />
                </a>
              )}
              {proyecto.url_demo && (
                <a href={proyecto.url_demo} data-proyecto-action="clic_demo" target="_blank" className="text-white/70 hover:text-blue-400 transition-colors">
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
            <button data-proyecto-action="clic_detalle" className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#0a1120] hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg">
              <ArrowUpRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeccionProyectos;