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
  const [paginaActual, setPaginaActual] = useState(1);
  const paginacion = 5;

  const indexUltimo = paginaActual * paginacion;
  const indexPrimero = indexUltimo - paginacion;
  const proyectosPaginados = proyectos.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(proyectos.length / paginacion);

  
  const closeModal = () => {
    setModalAbierto(false);
    setProyectoEditar(null);
  };

  const handleEditar = (proyecto: Proyecto) => {
    setProyectoEditar(proyecto);
    setModalAbierto(true);
  }

    return (
      <DashboardLayout>
        <Banner 
          titulo="Proyectos" 
          descripcion="Gestiona tus proyectos de software" 
          onOpenModal={() => {
            setProyectoEditar(null);
            setModalAbierto(true);
          }} 
          textoBoton="Añadir Proyecto" >
        </Banner>
        <div className="py-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              proyectosPaginados.map((proyecto) => (
                <CardProyectos
                  onEditar={handleEditar}
                  key={proyecto.id_proyecto}
                  proyecto={proyecto}
                />
              ))
            )}
        </div>
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(paginaActual - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="font-medium">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(paginaActual + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

            <Modal isOpen={ModalAbierto} closeModal={closeModal} maxWidth="max-w-3xl">
              <FormularioProyecto 
              proyectoEditar={proyectoEditar}
              closeModal={closeModal}
              onCreated={(proyectoGuardado) => {
                setProyectos((prev) => {
                const existe = prev.some(
                  p => p.id_proyecto === proyectoGuardado.id_proyecto
                );
                if (existe) {
                  return prev.map(p =>
                    p.id_proyecto === proyectoGuardado.id_proyecto
                      ? proyectoGuardado
                      : p
                  );
                }
                return [proyectoGuardado, ...prev];
              });
            }} />
            </Modal>
        </div>
      </DashboardLayout>
    )
}