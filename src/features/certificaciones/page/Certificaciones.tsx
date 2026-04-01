import { useState } from "react";
import { useCategorias } from '../hooks/useCategorias';
import { useCertificaciones } from "../hooks/useCertificaciones";

import { Banner } from "../components/BannerCertificaciones";
// Importa las versiones corregidas y responsivas de los componentes
import { Modal } from "../components/Modal"; 
import { InputCertificaciones } from "../components/InputCertificaciones";
import { FechaInput } from "../components/FechaInput";

// Asumimos que estos siguen igual o ya son responsivos
import { ImagenUploader } from "../components/ImagenUploader";
import { CategoriaCard } from "../components/carruselCards/CategoriaCard";
import { Carousel } from "../components/carruselCards/Carrusel";
import { DropdownCertificaciones } from "../components/DropdownCertificaciones";
import { CertificadosGrid } from "../components/CertificadosGrid";
import DashboardLayout from "@/layout/DashboardLayout";

const ID_PORTAFOLIO_ACTUAL = "cc38c98a-8edd-4145-bd6e-e8b81280cbf9";

export default function Certificaciones() {
  const [openModal, setOpenModal] = useState(false);
  const [filtroCategoriaId, setFiltroCategoriaId] = useState<string | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<{label: string, value: string} | null>(null);
  const { categorias, isLoading, isUsingFallback } = useCategorias();
  
  const { 
    certificados, 
    isLoadingCerts, 
    isUsingFallbackCerts 
  } = useCertificaciones(ID_PORTAFOLIO_ACTUAL, filtroCategoriaId);

  const opcionesCategorias = categorias.map((cat) => ({
    label: cat.nombre,
    value: cat.id,
  }));

  return (
    <DashboardLayout>
      <div className="p-2 sm:p-4 space-y-6">

        <Banner onOpenModal={() => setOpenModal(true)} />

        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
          <h2 className="text-lg font-semibold mb-6 text-left text-gray-700">
            Subir certificación
          </h2>

          {/* Cambio Responsivo Principal: flex-col en móviles, md:flex-row en tablets/desktop */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            
            {/* FORMULARIO */}
            {/* Usando la versión responsiva de w-full */}
            <div className="w-full md:w-[280px] flex flex-col gap-4">
              <DropdownCertificaciones
                titulo="Categoría"
                placeholder={isLoading ? "Cargando categorías..." : "Categorías"}
                opciones={opcionesCategorias}
                value={categoriaSeleccionada}
                onChange={(opcion) => setCategoriaSeleccionada(opcion)}
              />
              {/* Usando las versiones responsivas corregidas anteriormente */}
              <InputCertificaciones titulo="Título" tamMax={100} height={40} />
              <FechaInput titulo="Fecha de emisión" />
              <InputCertificaciones titulo="Descripción" tamMax={300} height={80} />
            </div>

            {/* IMAGEN */}
            <div className="flex-1 w-full">
              {/* SOLUCIÓN DE SUPERPOSICIÓN: Cambiado alto responsivo flexible */}
              {/* h-auto en móviles para dejar crecer, md:h-[260px] en escritorio para mantener el diseño original */}
              <div className="w-full h-auto md:h-[260px]">
                <ImagenUploader />
              </div>
            </div>
          </div>

          {/* BOTONES PRINCIPALES: responsivos y apilados en móvil */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              onClick={() => setOpenModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center"
            >
              Cancelar
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center">
              Subir
            </button>
          </div>
        </Modal>

        {/* CATEGORÍAS (responsivo corregido anteriormente) */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <h3 className="text-sm text-dark-500 font-medium-ui text-left flex flex-wrap items-center gap-2">
              Categorías
              {isUsingFallback && (
                <span className="text-xs text-orange-500 font-normal">
                  (Modo de prueba)
                </span>
              )}
            </h3>

            {filtroCategoriaId && (
              <button 
                onClick={() => setFiltroCategoriaId(null)}
                className="text-xs text-blue-500 hover:underline cursor-pointer"
              >
                Ver todas las certificaciones
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-gray-400">
              Cargando categorías...
            </div>
          ) : (
            <Carousel>
              {/* Mismo mapeo de categorías */}
              {categorias.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => setFiltroCategoriaId(cat.id)}
                  className={`cursor-pointer transition-all duration-200 ${
                    filtroCategoriaId === cat.id ? 'ring-2 ring-blue-500 rounded-lg scale-105' : 'hover:scale-105'
                  }`}
                >
                  <CategoriaCard
                    title={cat.nombre}
                    description={cat.descripcion}
                    image={cat.url_imagen}
                  />
                </div>
              ))}
            </Carousel>
          )}
        </div>

        {/* CERTIFICACIONES (responsivo corregido anteriormente) */}
        <h2 className="
          text-lg
          sm:text-xl
          md:text-4xl
          lg:text-5xl
          text-dark-500
          tracking-widest
          font-semibold-ui
          mt-6
          flex justify-center text-center items-center gap-2
        ">
          CERTIFICACIONES
          {isUsingFallbackCerts && (
            <span className="text-xs text-orange-500 font-normal tracking-normal hidden sm:inline"></span>
          )}
        </h2>
        
        {/* Manejo de carga y grid de certificados igual */}
        {isLoadingCerts ? (
          <div className="flex justify-center items-center h-40 text-gray-400">
            Cargando certificaciones...
          </div>
        ) : certificados.length === 0 ? (
           <div className="text-center text-gray-500 py-10">
             No hay certificaciones en esta categoría.
           </div>
        ) : (
          <CertificadosGrid certificados={certificados} />
        )}

      </div>
    </DashboardLayout>
  );
}