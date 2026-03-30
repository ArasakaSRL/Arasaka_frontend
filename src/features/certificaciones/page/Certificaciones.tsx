import { useState } from "react";
import { useCategorias } from '../hooks/useCategorias';

import { Banner } from "../components/BannerCertificaciones";
import { Modal } from "../components/Modal";
import { ImagenUploader } from "../components/ImagenUploader";
import { InputCertificaciones } from "../components/InputCertificaciones";
import { FechaInput } from "../components/FechaInput";
import { CategoriaCard } from "../components/carruselCards/CategoriaCard";
import { Carousel } from "../components/carruselCards/Carrusel";
import { DropdownCertificaciones } from "../components/DropdownCertificaciones";

export function Certificaciones() {
  const [openModal, setOpenModal] = useState(false);
  
  // Extraemos las categorías, estado de carga y si estamos en modo prueba
  const { categorias, isLoading, isUsingFallback } = useCategorias();

  return (
    <section>
      <div className="p-1 space-y-6">

        <Banner onOpenModal={() => setOpenModal(true)} />

        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
          <h2 className="text-lg font-semibold mb-6 text-left text-gray-700">
            Subir certificación
          </h2>

          <div className="flex gap-10 items-start">
            {/* FORMULARIO */}
            <div className="w-[280px] flex flex-col gap-4">
              <DropdownCertificaciones
                titulo="Certificación"
                placeholder="Categoria"
                opciones={[
                  { label: "AWS", value: "aws" },
                  { label: "Azure", value: "azure" },
                  { label: "Google Cloud", value: "gcp" },
                ]}
              />
              <InputCertificaciones titulo="Título" tamMax={100} height={40} />
              <FechaInput titulo="Fecha de emisión" />
              <InputCertificaciones titulo="Descripción" tamMax={300} height={80} />
            </div>

            {/* IMAGEN */}
            <div className="flex-1">
              <div className="w-full h-[260px]">
                <ImagenUploader />
              </div>
            </div>
          </div>

          {/* BOTONES */}
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

        {/*  CATEGORÍAS */}
        <div>
          <h3 className="text-sm text-dark-500 font-medium-ui mb-3 text-left flex items-center gap-2">
            Categorías
            {/* Pequeño indicador visual por si estamos usando los datos de prueba */}
            {isUsingFallback && (
              <span className="text-xs text-orange-500 font-normal">
                (Modo de prueba)
              </span>
            )}
          </h3>

          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-gray-400">
              Cargando categorías...
            </div>
          ) : (
            <Carousel>
              {categorias.map((cat) => (
                <CategoriaCard
                  key={cat.id} // Siempre es buena práctica usar el ID real
                  title={cat.nombre}
                  description={cat.descripcion}
                  image={cat.url_imagen}
                />
              ))}
            </Carousel>
          )}
        </div>

        <h2 className="text-center text-lg text-dark-500 tracking-widest font-semibold-ui mt-6">
          CERTIFICACIONES
        </h2>

      </div>
    </section>
  );
}