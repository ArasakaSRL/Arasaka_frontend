import { useState } from "react";
import { Banner } from "../components/BannerCertificaciones";
import { CategoriaCard } from "../components/CategoriaCard";
import { Modal } from "../components/Modal";
import { ImagenUploader } from "../components/ImagenUploader";
import { InputCertificaciones } from "../components/InputCertificaciones";
import { FechaInput } from "../components/FechaInput";

export function Certificaciones() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section>
      <div className="p-1 space-y-6">

        <Banner onOpenModal={() => setOpenModal(true)} />

        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>

          <h2 className="text-md font-semibold mb-4">
            Subir certificación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* 🧾 FORMULARIO */}
            <div className="flex flex-col gap-5">

              <InputCertificaciones
                titulo="Categoría"
                tamMax={20}
                height={40}
              />

              <InputCertificaciones
                titulo="Título"
                tamMax={100}
                height={40}
              />

              <FechaInput titulo="Fecha de emisión" />

              <InputCertificaciones
                titulo="Descripción"
                tamMax={300}
                height={80}
              />

            </div>

            {/* 🖼 IMAGEN */}
            <div className="flex flex-col gap-3">
              <label className="text-sm text-gray-600">
                Subir nueva imagen
              </label>

              <div className="flex justify-center">
                <ImagenUploader />
              </div>
            </div>

          </div>

          {/* 🔘 BOTONES */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setOpenModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>

            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Subir
            </button>
          </div>

        </Modal>

        {/* 📂 CATEGORÍAS */}
        <div>
          <h3 className="text-sm text-dark-500 font-medium-ui mb-3 text-left">
            Categorías
          </h3>

          <CategoriaCard
            title="Académico"
            description="Diplomas, logros educativos, etc"
            image="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
          />

          <CategoriaCard
            title="Idiomas"
            description="Diplomas y certificados, etc"
            image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          />
        </div>

        <h2 className="text-center text-lg text-dark-500 tracking-widest font-semibold-ui">
          CERTIFICACIONES
        </h2>

      </div>
    </section>
  );
}