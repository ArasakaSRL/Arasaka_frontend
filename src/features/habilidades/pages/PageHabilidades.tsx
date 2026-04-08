import { useState } from "react";
import ModalForm from "../../../components/Modal";
import FormularioHabilidades from "../components/FormularioHabilidades";
import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/features/hitos/components/BannerHitos";
import ListaHabilidad from "../components/ListaHabilidad";

export default function PageHabilidades() {
  const [ModalAbierto, setModalAbierto] = useState(false);
  const closeModal = () => setModalAbierto(false);

return(
      <DashboardLayout>
        <Banner 
          titulo="Habilidades" 
          descripcion="Gestiona tus habilidades y conocimientos" 
          onOpenModal={() => setModalAbierto(true)} 
          textoBoton="Añadir Habilidad" /> 
        <div className="py-4 w-full">
          <ListaHabilidad />
              <ModalForm isOpen={ModalAbierto} closeModal={closeModal} maxWidth="max-w-xl">
                <FormularioHabilidades closeModal={closeModal}/>
              </ModalForm>
        </div> 
      </DashboardLayout>
    )
}