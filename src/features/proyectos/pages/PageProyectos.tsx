import { useState } from "react";
import Modal from "@/components/Modal"
import FormularioProyecto from "../components/FormularioProyectos";
import DashboardLayout from "@/layout/DashboardLayout";
import { useProyectos } from "../hooks/getProyectos";
import { Banner } from "@/components/Banner";
import type { Proyecto } from "../lib/ProyectosApi";
import { eliminarProyecto } from "../lib/ProyectosApi";
import ListaProyectos from "../components/ListaProyectos";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { toast } from "../../../components/Alerta";
import Paginacion from "@/components/Paginacion";
import { AnimatePresence, motion } from "framer-motion";

export default function PageProyectos() {
  const [ModalAbierto, setModalAbierto] = useState(false);
  const { proyectos, loading, setProyectos } = useProyectos();
  const [proyectoEditar, setProyectoEditar] = useState<Proyecto | null>(null);
  const [proyectoEliminar, setProyectoEliminar] = useState<Proyecto | null>(null);
  const [modoAccion, setModoAccion] = useState<"editar" | "eliminar" | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const paginacion = 5;

  const indexUltimo = paginaActual * paginacion;
  const indexPrimero = indexUltimo - paginacion;
  const proyectosPaginados = proyectos.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(proyectos.length / paginacion);

  const cambioPagina = (nuevaPagina: number) => {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas
    )
      return;

    setPaginaActual(nuevaPagina);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const closeModal = () => {
    setModalAbierto(false);
    setProyectoEditar(null);
    setModoAccion(null);
  };

  const handleEditar = (proyecto: Proyecto) => {
    setProyectoEditar(proyecto);
    setModalAbierto(true);
  };

  const handleEliminar = async (id_proyecto: string) => {
    try {
      await eliminarProyecto(id_proyecto);
      setProyectos((prev) => prev.filter((p) => p.id_proyecto !== id_proyecto));
      toast.success("Proyecto eliminado exitosamente");
    } catch (err) {
      console.log(err);
      toast.error("Error al eliminar el proyecto");
    }
  };

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
            toast.warning("Selecciona un proyecto");
            setModoAccion("editar");
          }}
          onEliminar={() => {
            toast.warning("Selecciona un proyecto");
            setModoAccion("eliminar");
          }}
          onCancelar={() => {
            setModoAccion(null);
            setProyectoEliminar(null);
          }}>
        </Banner>
        <AnimatePresence mode="wait">
          <motion.div
            key={paginaActual}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="py-4"
          >
            <ListaProyectos
              proyectos={proyectosPaginados}
              loading={loading}
              modoAccion={modoAccion}
              onEditar={(proyecto) => {
                handleEditar(proyecto);
                setModoAccion(null);
              }}
              onEliminar={(proyecto) => {
                setProyectoEliminar(proyecto);
              }}
            />

          <Paginacion
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={cambioPagina}
          />


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

            <ConfirmDeleteModal
              isOpen={!!proyectoEliminar}
              nombre={proyectoEliminar?.nombre}
              onClose={() => {
                setProyectoEliminar(null);
                setModoAccion(null);
              }}
              onConfirm={async () => {
                if (!proyectoEliminar) return;
                await handleEliminar(proyectoEliminar.id_proyecto);
                setProyectoEliminar(null);
                setModoAccion(null);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
    )
}