import { useState } from "react";
import Modal from "@/components/Modal"
import FormularioProyecto from "../components/FormularioProyectos";
import DashboardLayout from "@/layout/DashboardLayout";
import { useProyectos } from "../hooks/getProyectos";
import { Banner } from "@/components/Banner";
import type { Proyecto } from "../lib/ProyectosApi";
import ListaProyectos from "../components/ListaProyectos";
export default function PageProyectos() {
  const [ModalAbierto, setModalAbierto] = useState(false);
  const { proyectos, loading, setProyectos } = useProyectos();
  const [proyectoEditar, setProyectoEditar] = useState<Proyecto | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [proyectoEliminar, setProyectoEliminar] = useState<Proyecto | null>(null);
  const [modoAccion, setModoAccion] = useState<"editar" | "eliminar" | null>(null);
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
          totalItems={proyectos.length}
          editando={modoAccion === "editar"}
          eliminando={modoAccion === "eliminar"}
          onAgregar={() => {
            setModoAccion(null);
            setProyectoEditar(null);
            setModalAbierto(true);
          }}
          onEditar={() => {
            setModoAccion("editar");
          }}
          onCancelar={() => {
            setModoAccion(null);
            setProyectoEliminar(null);
          }}>
        </Banner>
        <div className="py-4 w-full">
          <ListaProyectos
            proyectos={proyectosPaginados}
            loading={loading}
            modoAccion={modoAccion}
            onEditar={(proyecto) => {
              handleEditar(proyecto);
              setModoAccion(null);
            }}
            onEliminarSeleccionado={(proyecto) => {
              setProyectoEliminar(proyecto);
            }}
          />
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">

              <button
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
                className="
                  px-3 py-1
                  bg-gray-200
                  rounded
                  disabled:opacity-50
                "
              >
                Anterior
              </button>

              <span className="font-medium">
                Página {paginaActual} de {totalPaginas}
              </span>

              <button
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
                className="
                  px-3 py-1
                  bg-gray-200
                  rounded
                  disabled:opacity-50
                "
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