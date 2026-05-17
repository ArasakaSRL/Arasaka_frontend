import { ArrowLeft, CalendarDays, ExternalLink } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
export default function PageVistaProyecto() {
  
  const navigate = useNavigate();

  const { slug} = useParams();

  // MOCK TEMPORAL
  const proyecto = {
    nombre: 'E-Commerce de Nueva Generación',

    descripcion:
      'Una plataforma completa de comercio electrónico construida con un enfoque en la velocidad y la experiencia del usuario. Incluye gestión de inventario en tiempo real, pasarela de pagos integrada y un panel de administración avanzado para análisis de ventas.',

    tecnologias: [
      'React',
      'Typescript',
      'Vue',
      'CSS',
      'Javascript',
      'TailwindCss',
      'PostgreSQL',
    ],

    fecha_inicio: '2003-09-02',

    fecha_fin: '2003-09-02',

    imagen:
      'https://placehold.co/700x500/e5e7eb/9ca3af?text=Proyecto',

    github: '#',

    demo: '#',
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-6 py-8">

      {/* VOLVER */}

      <button
        onClick={() => navigate(`/portafolio/${slug}`)}
        className="flex items-center gap-2 font-semibold mb-12 hover:opacity-70 transition"
      >
        <ArrowLeft size={22} />
        Volver
      </button>

      {/* CONTENIDO */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* IZQUIERDA */}

        <div>

          <p className="uppercase text-left tracking-widest text-sm mb-4">
            ⓘ Detalles del Proyecto
          </p>

          <p className="text-3xl text-left font-black leading-tight mb-8">
            {proyecto.nombre}
          </p>

          <h2 className="text-3xl font-semibold mb-6 text-left">
            Sobre el proyecto
          </h2>

          <p className="text-gray-700 leading-8 text-lg mb-12 text-left">
            {proyecto.descripcion}
          </p>

          {/* TECNOLOGIAS */}

          <div>

            <p className="uppercase text-left tracking-widest text-sm mb-5">
              {'</>'} Tecnologías
            </p>

            <div className="bg-[#ececec] rounded-3xl p-6 flex flex-wrap gap-3">

              {proyecto.tecnologias.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-1.5 rounded-full border border-[#24348b] text-[#24348b] text-sm font-medium"
                >
                  {tech}
                </span>
              ))}

            </div>

          </div>

        </div>

        {/* DERECHA */}

        <div className="flex flex-col gap-6">

          {/* FECHAS */}

          <div className="bg-[#24348b] rounded-3xl p-6 flex justify-between text-white">

            <div className="flex gap-3 items-start">

              <CalendarDays size={20} />

              <div>
                <p className="uppercase text-sm font-bold">
                  Inicio
                </p>

                <p>
                  {proyecto.fecha_inicio}
                </p>
              </div>

            </div>

            <div className="flex gap-3 items-start">

              <CalendarDays size={20} />

              <div>
                <p className="uppercase text-sm font-bold">
                  Fin
                </p>

                <p>
                  {proyecto.fecha_fin}
                </p>
              </div>

            </div>

          </div>

          {/* IMAGEN */}

          <div className="bg-[#d9d9d9] rounded-3xl overflow-hidden">

            <img
              src={proyecto.imagen}
              alt={proyecto.nombre}
              className="w-full h-80 object-cover"
            />

          </div>

          {/* ACCIONES */}

          <div className="bg-[#ececec] rounded-3xl p-6 flex gap-6 justify-center">

            <a
              href={proyecto.github}
              target="_blank"
              className="w-28 h-20 bg-[#d5d5d5] rounded-2xl flex items-center justify-center hover:scale-105 transition"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
                className="w-7 h-7"
              />
            </a>

            <a
              href={proyecto.demo}
              target="_blank"
              className="w-28 h-20 bg-[#d5d5d5] rounded-2xl flex items-center justify-center hover:scale-105 transition"
            >
              <ExternalLink size={28} />
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}