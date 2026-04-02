import { useState } from "react";
import Modal from "@/components/Modal"
import FormularioProyecto from "../components/FormularioProyectos";
import CardProyectos from "../components/CardProyectos";
import DashboardLayout from "@/layout/DashboardLayout";
import { CirclePlus } from "lucide-react";

import { useProyectos } from "../hooks/getProyectos";

export default function PageProyectos() {
  const [ModalAbierto, setModalAbierto] = useState(false);
  const idPortafolio = "d978f395-f04f-41ab-ada8-18ca70d5abc7";
  const { proyectos, loading } = useProyectos(idPortafolio);

  const closeModal = () => setModalAbierto(false);
    return (
      <DashboardLayout>
        <div className="px-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl! text-left font-bold text-black">Proyectos</h3>
              <p className="text-sm text-gray-700! text-left">Gestiona tus proyectos de software</p>
            </div>
                <button
                onClick={() => setModalAbierto(true)} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white cursor-pointer hover:bg-secondary-500">
                  <CirclePlus />
                    Añadir Proyecto
                </button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
                {loading ? (
    <p>Cargando...</p>
  ) : (
    proyectos.map((proyecto) => (
      <CardProyectos
        key={proyecto.id_proyecto}
        proyecto={{
          id: proyecto.id_proyecto,
          nombre: proyecto.nombre,
          descripcion: proyecto.descripcion ?? "",
          fecha_inicio: proyecto.fecha_inicio,
          fecha_fin: proyecto.fecha_fin ?? undefined,
          tecnologias: proyecto.tecnologias
        }}
      />
    ))
  )}
            </div>

            <Modal isOpen={ModalAbierto} closeModal={closeModal} maxWidth="max-w-2xl">
              <FormularioProyecto closeModal={closeModal}/>
            </Modal>
        </div>
      </DashboardLayout>
    )
}