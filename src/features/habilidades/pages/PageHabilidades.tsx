import { CirclePlus } from "lucide-react";
import { useState } from "react";
import ModalForm from "../../../components/Modal";
import FormularioHabilidades from "../components/FormularioHabilidades";
import DashboardLayout from "@/layout/DashboardLayout";

export default function PageHabilidades() {
  const [ModalAbierto, setModalAbierto] = useState(false);

  const closeModal = () => setModalAbierto(false);
return(
      <DashboardLayout>
        <div className="px-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl! text-left font-bold text-black">Habilidades</h3>
                <p className="text-sm text-gray-700! text-left">Administra tus habilidades técnicas y blandas</p>
              </div>
                  <button
                  onClick={() => setModalAbierto(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white cursor-pointer hover:bg-secondary-500">
                    <CirclePlus />
                    Añadir Habilidad
                  </button>
              </div>
              <ModalForm isOpen={ModalAbierto} closeModal={closeModal} maxWidth="max-w-xl">
                <FormularioHabilidades closeModal={closeModal}/>
              </ModalForm>
        </div> 
      </DashboardLayout>
    )
}