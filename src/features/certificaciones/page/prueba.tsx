import { useState } from 'react';
import { useCategorias } from '../hooks/useCategorias'; // <-- Importamos nuestro hook

import { Banner } from '../components/BannerCertificaciones';

import { Modal } from '../components/Modal';
import { ImagenUploader } from '../components/ImagenUploader';
import { InputCertificaciones } from '../components/InputCertificaciones';
import { FechaInput } from '../components/FechaInput';
import { CategoriaCard } from '../components/carruselCards/CategoriaCard';

export function Certificaciones() {
  const [openModal, setOpenModal] = useState(false);
  
  // Usamos el hook para obtener los datos del backend
  const { categorias, isLoading, error } = useCategorias();

  return (
    <section>
      <div className="p-1 space-y-6">
        <Banner onOpenModal={() => setOpenModal(true)} />

        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
          <h2 className="text-lg font-semibold mb-6 text-left text-gray-700">
            Subir certificación
          </h2>

          <div className="flex gap-10 items-start">
            {/* 🧾 FORMULARIO */}
            <div className="w-[280px] flex flex-col gap-4">
              {/* Opcional: Aquí podrías iterar las categorías para hacer un <select> en lugar de un input */}
              <InputCertificaciones titulo="Categoría" tamMax={20} height={40} />
              <InputCertificaciones titulo="Título" tamMax={100} height={40} />
              <FechaInput titulo="Fecha de emisión" />
              <InputCertificaciones titulo="Descripción" tamMax={300} height={80} />
            </div>

            {/* 🖼 IMAGEN */}
            <div className="flex-1">
              <div className="w-full h-[260px]">
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
            <button className="bg-green-500 text-white px-4 py-2 rounded">Subir</button>
          </div>
        </Modal>

        {/* 📂 CATEGORÍAS RENDERIZADAS DINÁMICAMENTE */}
        <div>
          <h3 className="text-sm text-dark-500 font-medium-ui mb-3 text-left">
            Categorías
          </h3>
          
          {/* Manejo de Estados de Carga y Error */}
          {isLoading && <p className="text-gray-500">Cargando categorías...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Renderizado de la lista */}
          {!isLoading && !error && categorias.map((categoria) => (
            <CategoriaCard
              key={categoria.id}
              title={categoria.nombre}
              description={categoria.descripcion}
              image={categoria.url_imagen}
            />
          ))}
        </div>

        <h2 className="text-center text-lg text-dark-500 tracking-widest font-semibold-ui mt-6">
          CERTIFICACIONES
        </h2>
      </div>
    </section>
  );
}