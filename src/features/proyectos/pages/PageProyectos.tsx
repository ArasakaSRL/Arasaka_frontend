import { useState } from "react";
import ModalForm from "../components/ModalProyectos"
import FormularioProyecto from "../components/FormularioProyectos";
// import CardProyectos from "../components/CardProyectos";
import DashboardLayout from "@/layout/DashboardLayout";
import { CirclePlus } from "lucide-react";

export default function PageProyectos() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
    return (
      <DashboardLayout>
        <div className="px-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl! text-left font-bold text-black">Proyectos</h3>
              <p className="text-sm text-gray-700! text-left">Gestiona tus proyectos de software</p>
            </div>
                <button
                onClick={() => setIsModalOpen(true)} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white cursor-pointer hover:bg-secondary-500">
                  <CirclePlus />
                    Añadir Proyecto
                </button>
            </div>
            {/* <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
                {proyectosMock.map((proyecto) => (
                  <CardProyectos key={proyecto.id} proyecto={proyecto} />
                ))}
            </div> */}

            <ModalForm isOpen={isModalOpen} closeModal={closeModal} maxWidth="max-w-2xl">
              <FormularioProyecto closeModal={closeModal}/>
            </ModalForm>
        </div>
      </DashboardLayout>
    )
}