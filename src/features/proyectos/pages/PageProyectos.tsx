import { useState } from "react";
import Modal from "@/components/Modal"
import FormularioProyecto from "../components/FormularioProyectos";
import CardProyectos from "../components/CardProyectos";
import DashboardLayout from "@/layout/DashboardLayout";
import { useProyectos } from "../hooks/getProyectos";
import { Banner } from "@/features/hitos/components/BannerHitos";
import type { Proyecto } from "../lib/ProyectosApi";
export default function PageProyectos() {
  const [ModalAbierto, setModalAbierto] = useState(false);
  const { proyectos, loading, setProyectos } = useProyectos();
  const [proyectoEditar, setProyectoEditar] = useState<Proyecto | null>(null);
  
  const closeModal = () => setModalAbierto(false);

  const handleEditar = (proyecto: Proyecto) => {
    setProyectoEditar(proyecto);
    setModalAbierto(true);
  }

    return (
      <DashboardLayout>
        <Banner titulo="Proyectos" descripcion="Gestiona tus proyectos de software" onOpenModal={() => setModalAbierto(true)} textoBoton="Añadir Proyecto" >
        </Banner>
        <div className="py-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              proyectos.map((proyecto) => (
                <CardProyectos
                  onEditar={handleEditar}
                  key={proyecto.id_proyecto}
                  proyecto={proyecto}
                />
              ))
            )}
        </div>

            <Modal isOpen={ModalAbierto} closeModal={closeModal} maxWidth="max-w-2xl">
              <FormularioProyecto 
              proyectoEditar={proyectoEditar}
              closeModal={closeModal}   
              onCreated={(nuevoProyecto) => { setProyectos((prev) => [nuevoProyecto, ...prev]);}}/>
            </Modal>
        </div>
      </DashboardLayout>
    )
}