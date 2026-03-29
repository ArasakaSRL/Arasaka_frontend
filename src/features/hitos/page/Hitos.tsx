import { useState } from "react";
import { Banner } from "../components/BannerHitos";
import { Modal } from "../components/Modal";
import { InputHitos } from "../components/InputHitos";
import { FechaInputHitos } from "../components/FechaInputHitos";

export function Hitos() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section>
        
      <Banner onOpenModal={() => setOpenModal(true)} />
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Registrar Hito">
  
        <InputHitos titulo="Nombre del Cargo/Titulo" tamMax={50} height={40} />

        <InputHitos titulo="Nombre de la Organizacion" tamMax={50} height={40} />

        <InputHitos titulo="Descripcion" tamMax={300} height={80} />

        <FechaInputHitos titulo="Fecha de inicio" />
        <FechaInputHitos titulo="Fecha de fin" />

        {/* 🔘 Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => setOpenModal(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Cancelar
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Guardar
          </button>
        </div>

      </Modal>
    </section>
  );
}