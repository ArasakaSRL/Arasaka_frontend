/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import ModalForm from "../../../components/Modal";
import FormularioHabilidades from "../components/FormularioHabilidades";
import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/features/hitos/components/BannerHitos";
import ListaHabilidad from "../components/ListaHabilidad";
import { obtenerHabilidades, type HabilidadUI ,eliminarHabilidad} from "../lib/HabilidadesApi";
import { toast } from "../../../components/Alerta";

export default function PageHabilidades() {
  const [ModalAbierto, setModalAbierto] = useState(false);
  const closeModal = () => {
    setModalAbierto(false);
    setHabilidadesEditar(null);
  };

  const [habilidades, setHabilidades] = useState<HabilidadUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [habilidadesEditar, setHabilidadesEditar] = useState<HabilidadUI | null>(null);

  
  const fetchHabilidades = async () => {
    const data = await obtenerHabilidades();
    setHabilidades(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHabilidades();
  }, []);

  const handleEditar = (habilidad: HabilidadUI) => {
    setHabilidadesEditar(habilidad);
    setModalAbierto(true);
  }

  const handleEliminar = async (id_habilidad: string) => {
    try {
      const response = await eliminarHabilidad(id_habilidad);
      if (response.message!== "Error al eliminar la habilidad") {
        setHabilidades((prev) => prev.filter((h) => h.id_habilidad !== id_habilidad));
        toast.success("Habilidad eliminada exitosamente");
      } else {
        toast.error("Error al eliminar la habilidad");
      }
    }catch (err){
      console.log(err)
    }
  };


return(
      <DashboardLayout>
        <Banner 
          titulo="Habilidades" 
          descripcion="Gestiona tus habilidades y conocimientos" 
          onOpenModal={() => setModalAbierto(true)} 
          textoBoton="Añadir Habilidad" /> 
        <div className="py-4 w-full">
          <ListaHabilidad habilidad={habilidades} load={loading} onEditar={handleEditar} onEliminar={handleEliminar}/>
              <ModalForm isOpen={ModalAbierto} closeModal={closeModal} maxWidth="max-w-xl">
                <FormularioHabilidades 
                closeModal={closeModal}     
                onCreated={(habilidadActualizada) => {
                  console.log("Habilidad recibida:", habilidadActualizada);
                  if (habilidadesEditar) {
                    setHabilidades((prev) =>
                      prev.map((h) =>
                        h.id_habilidad === habilidadesEditar.id_habilidad
                          ? habilidadActualizada
                          : h
                      )
                    );
                  } else {
                    setHabilidades((prev) => [habilidadActualizada, ...prev]);
                  }
                }}
                habilidadEditar={habilidadesEditar}
                habilidadesExistentes={habilidades}
                />
              </ModalForm>
        </div> 
      </DashboardLayout>
    )
}