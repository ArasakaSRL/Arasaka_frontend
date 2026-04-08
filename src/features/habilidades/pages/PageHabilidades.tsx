/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import ModalForm from "../../../components/Modal";
import FormularioHabilidades from "../components/FormularioHabilidades";
import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/features/hitos/components/BannerHitos";
import ListaHabilidad from "../components/ListaHabilidad";
import { obtenerHabilidades, type HabilidadUI } from "../lib/HabilidadesApi";

export default function PageHabilidades() {
  const [ModalAbierto, setModalAbierto] = useState(false);
  const closeModal = () => setModalAbierto(false);

  const [habilidades, setHabilidades] = useState<HabilidadUI[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabilidades = async () => {
    const data = await obtenerHabilidades();
    setHabilidades(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHabilidades();
  }, []);

return(
      <DashboardLayout>
        <Banner 
          titulo="Habilidades" 
          descripcion="Gestiona tus habilidades y conocimientos" 
          onOpenModal={() => setModalAbierto(true)} 
          textoBoton="Añadir Habilidad" /> 
        <div className="py-4 w-full">
          <ListaHabilidad habilidad={habilidades} load={loading}/>
              <ModalForm isOpen={ModalAbierto} closeModal={closeModal} maxWidth="max-w-xl">
                <FormularioHabilidades 
                closeModal={closeModal}     
                onCreated={(nuevaHabilidad) => { setHabilidades((prev) => [nuevaHabilidad, ...prev]);}}/>
              </ModalForm>
        </div> 
      </DashboardLayout>
    )
}