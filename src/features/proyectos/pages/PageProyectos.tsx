import { useState } from "react";
import ModalForm from "../components/ModalProyectos"
import FormularioProyecto from "../components/FormularioProyectos";
import CardProyectos from "../components/CardProyectos";

export default function PageProyectos() {
  const proyectosMock = [
  {
    id: "1",
    nombre: "Aplicación de Gestión de Gastos Personales",
    descripcion:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    fecha_inicio: "2/9/2003",
    fecha_fin: "2/9/2003",
    tecnologias: ["React", "TypeScript", "PostgreSQL"],
  },
  {
    id: "2",
    nombre: "Aplicación de Gestión de Gastos Personales",
    descripcion:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    fecha_inicio: "2/9/2003",
    fecha_fin: "2/9/2003",
    tecnologias: ["React", "TypeScript", "PostgreSQL"],
  },
    {
    id: "3",
    nombre: "Aplicación de Gestión de Gastos Personales",
    descripcion:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    fecha_inicio: "2/9/2003",
    fecha_fin: "2/9/2003",
    tecnologias: ["React", "TypeScript", "PostgreSQL"],
  },
];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
    return (
    <div className="px-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg text-left">Proyectos</h3>
          <p className="text-sm text-left">Gestiona tus proyectos de software</p>
        </div>
            <button
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-[#27496E]">
              Nuevo Proyecto
            </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
            {proyectosMock.map((proyecto) => (
              <CardProyectos key={proyecto.id} proyecto={proyecto} />
            ))}
        </div>

        <ModalForm isOpen={isModalOpen} closeModal={closeModal} maxWidth="max-w-2xl">
          <FormularioProyecto closeModal={closeModal}/>
        </ModalForm>
    </div>
    )
}