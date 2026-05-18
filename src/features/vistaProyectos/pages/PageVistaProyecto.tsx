import { ArrowLeft, Info, Code } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useVistaProyecto } from "../hooks/useVistaProyecto";
import { TecnologiasList } from "../components/TecnologiasLista";
import { CardFechas } from "../components/CardFechas";
import { ImagenProyecto } from "../components/ImagenProyectos";
import { ProyectoLinks } from "../components/LinksProyecto";
export default function PageVistaProyecto() {  
  const navigate = useNavigate();
  const { slug, id } =
  useParams<{
    slug: string;
    id: string;
  }>();
  const { proyecto } = useVistaProyecto(id ?? "");
  console.log(proyecto);
  return (
    <main>
      <div className="min-h-screen bg-[#f5f5f5] px-10 py-10">
        {/* VOLVER */}
        <button
          onClick={() => navigate(`/portafolio/${slug}`)}
          className="flex items-center text-primary-500 gap-2 text-sm font-medium hover:opacity-70 transition"
        >
          <ArrowLeft size={22} />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-14 mt-10">
          <section className="space-y-8">
            <div>
              <p className="uppercase text-sm tracking-widest text-black pb-4 text-left">
                <Info size={18} className="inline mr-2" />
                Detalles del proyecto
              </p>

              <h1 className="uppercase text-5xl font-bold text-black text-left">
                {proyecto?.nombre}
              </h1>

              <h2 className="text-3xl font-normal text-left text-black">
                Sobre el proyecto
              </h2>

              <p className="text-black leading-relaxed text-lg text-left">
                {proyecto?.descripcion}
              </p>
            </div>

            <div>
              <p className="uppercase text-sm tracking-widest text-black pb-4 text-left">
                <Code size={18} className="inline mr-2" />Tecnologías
              </p>
              <div className="bg-white rounded-2xl px-6 py-4">
                <TecnologiasList tecnologias={proyecto?.tecnologias || []} />
              </div>
            </div>
          </section>
          <section className="space-y-6">
          <CardFechas
            inicio={proyecto?.fecha_inicio ?? ""}
            fin={proyecto?.fecha_fin ?? ""}
          />

          <ImagenProyecto
            imagenes={proyecto?.url_imagen || []}
          />

          <ProyectoLinks
            githubUrl={proyecto?.url_github ?? null}
            demoUrl={proyecto?.url_demo ?? null}
          />
        </section>
        </div>
      </div>
    </main>
  );
}