import { useState } from "react";
import ModalForm from "../components/ModalProyectos"
import FormularioProyecto from "../components/FormularioProyectos";

export default function PageProyectos() {
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B2A6D] text-white hover:bg-[#27496E]">
              Nuevo Proyecto
            </button>
        </div>
        <ModalForm isOpen={isModalOpen} closeModal={closeModal} maxWidth="max-w-2xl">
          <FormularioProyecto closeModal={closeModal}/>
        </ModalForm>
    </div>
    )
}