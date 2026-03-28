import { CirclePlus } from "lucide-react";
import { useState } from "react";
import ModalForm from "../../../components/Modal";
import FormularioHabilidades from "../components/FormularioHabilidades";

export default function PageHabilidades() {
  const [ModalAbierto, setModalAbierto] = useState(false);

  const closeModal = () => setModalAbierto(false);
return(
    <div className="px-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg text-left">Proyectos</h3>
            <p className="text-sm text-left">Gestiona tus proyectos de software</p>
          </div>
              <button
              onClick={() => setModalAbierto(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-[#27496E]">
                <CirclePlus />
                Añadir Habilidad
              </button>
          </div>
          <ModalForm isOpen={ModalAbierto} closeModal={closeModal} maxWidth="max-w-xl">
            <FormularioHabilidades closeModal={closeModal}/>
          </ModalForm>
    </div> 
    )
}