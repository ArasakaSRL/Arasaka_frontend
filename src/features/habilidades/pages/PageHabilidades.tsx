/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import ModalForm from "../../../components/Modal";
import FormularioHabilidades from "../components/FormularioHabilidades";
import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/components/Banner";
import ListaHabilidad from "../components/ListaHabilidad";
import { obtenerHabilidades, type HabilidadUI ,eliminarHabilidad} from "../lib/HabilidadesApi";
import { toast } from "../../../components/Alerta";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function PageHabilidades() {
  const [ModalAbierto, setModalAbierto] = useState(false);
  const [habilidades, setHabilidades] = useState<HabilidadUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [habilidadesEditar, setHabilidadesEditar] = useState<HabilidadUI | null>(null);
  const [modoAccion, setModoAccion] = useState<"editar" | "eliminar" | null>(null);
  const [habilidadEliminar, setHabilidadEliminar] = useState<HabilidadUI | null>(null);
  const closeModal = () => {
    setModalAbierto(false);
    setHabilidadesEditar(null);
    setModoAccion(null);
    setHabilidadEliminar(null);
  };
  
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
          descripcion= "Gestiona tus habilidades y conocimientos"
          totalItems={habilidades.length}
          editando={modoAccion === "editar"}
          eliminando={modoAccion === "eliminar"}
          onAgregar={() => {
            setModoAccion(null);
            setHabilidadesEditar(null);
            setModalAbierto(true);
          }}
          onEditar={() => {
            toast.warning("Selecciona una habilidad");
            setModoAccion("editar");
          }}
          onEliminar={() => {
            toast.warning("Selecciona una habilidad");
            setModoAccion("eliminar");
          }}
          onCancelar={() => {
            setModoAccion(null);
            setHabilidadEliminar(null);
          }}
        />
        <div className="py-4 w-full">
          <ListaHabilidad 
            habilidad={habilidades} 
            load={loading}   
            onEditar={(hab) => {
              handleEditar(hab);

              setModoAccion(null);
            }} 
            onEliminar={(hab) => {
              setHabilidadEliminar(hab);
            }} 
            modoAccion={modoAccion}/>
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
              <ConfirmDeleteModal
                isOpen={!!habilidadEliminar}
                nombre={habilidadEliminar?.nombre}
                onClose={() => {
                  setHabilidadEliminar(null);
                  setModoAccion(null);
                }}
                onConfirm={async () => {
                  if (!habilidadEliminar) return;
                  await handleEliminar(
                    habilidadEliminar.id_habilidad
                  );
                  setHabilidadEliminar(null);
                  setModoAccion(null);
                }}
              />
        </div> 
      </DashboardLayout>
    )
}